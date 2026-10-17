import { useEffect, useState } from 'react';
import type { Reservation, ReservationDraft, Status } from '../types';
import { createMockReservations } from '../lib/mock';
import { changeReservationStatus, createReservation } from '../domain/commands';
import { readReservations, writeReservations } from '../services/reservationStorage';
export type MutationResult = { ok: true; persisted: boolean } | { ok: false; error: string };
export function useReservations() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [readFailed, setReadFailed] = useState(false);
  const [error, setError] = useState('');

  function persist(next: Reservation[]) {
    try {
      writeReservations(localStorage, next);
      setError('');
      return true;
    } catch {
      setError('ذخیره‌سازی انجام نشد. تغییرات فعلی با بستن صفحه از بین می‌روند.');
      return false;
    }
  }

  function reload() {
    setLoading(true);
    try {
      const saved = readReservations(localStorage);
      const next = saved ?? createMockReservations();
      setRows(next);
      setReadFailed(false);
      setError('');
      if (saved === null) persist(next);
    } catch {
      setReadFailed(true);
      setError(
        'داده‌های ذخیره‌شده قابل خواندن نیستند. دوباره تلاش کنید یا داده‌های نمونه را بازیابی کنید.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  function commit(next: Reservation[]): MutationResult {
    if (readFailed) return { ok: false, error: 'ابتدا خطای خواندن اطلاعات را برطرف کنید.' };
    setRows(next);
    return { ok: true, persisted: persist(next) };
  }
  function add(draft: ReservationDraft) {
    return commit([
      createReservation(draft, `NB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`),
      ...rows,
    ]);
  }

  function updateStatus(id: string, status: Status): MutationResult {
    const change = changeReservationStatus(rows, id, status);
    return change.ok ? commit(change.rows) : change;
  }

  function reset(): MutationResult {
    const next = createMockReservations();
    setRows(next);
    setReadFailed(false);
    return { ok: true, persisted: persist(next) };
  }

  function retry() {
    if (readFailed) reload();
    else persist(rows);
  }

  return { rows, loading, error, readFailed, add, updateStatus, reset, retry };
}
