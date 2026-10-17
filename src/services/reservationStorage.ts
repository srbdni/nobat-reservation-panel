import type { Reservation } from '../types';
import { isReservation } from '../domain/validation';
export const STORAGE_KEY = 'nobat.reservations.v1';

export function readReservations(storage: Pick<Storage, 'getItem'>): Reservation[] | null {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  const data: unknown = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    !data.every(isReservation) ||
    new Set(data.map((row) => row.id)).size !== data.length
  )
    throw new Error('Invalid reservation data');
  return data;
}
export function writeReservations(storage: Pick<Storage, 'setItem'>, rows: Reservation[]) {
  storage.setItem(STORAGE_KEY, JSON.stringify(rows));
}
