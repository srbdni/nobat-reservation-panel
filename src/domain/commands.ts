import type { Reservation, ReservationDraft, Status } from '../types';
import { normalize } from '../lib/text';

export function createReservation(draft: ReservationDraft, id: string): Reservation {
  return {
    ...draft,
    id,
    name: draft.name.trim(),
    phone: normalize(draft.phone),
    notes: draft.notes.trim(),
    status: 'pending',
  };
}


export type StatusChange = { ok: true; rows: Reservation[] } | { ok: false; error: string };
export function changeReservationStatus(
  rows: Reservation[],
  id: string,
  status: Status,
): StatusChange {
  const selected = rows.find((row) => row.id === id);
  if (!selected) return { ok: false, error: 'رزرو پیدا نشد.' };
  const conflict =
    status !== 'cancelled' &&
    rows.some(
      (row) =>
        row.id !== id &&
        row.status !== 'cancelled' &&
        row.phone === selected.phone &&
        row.date === selected.date &&
        row.time === selected.time,
    );
  if (conflict) return { ok: false, error: 'این مشتری در همین زمان رزرو فعال دیگری دارد.' };
  return { ok: true, rows: rows.map((row) => (row.id === id ? { ...row, status } : row)) };
}
