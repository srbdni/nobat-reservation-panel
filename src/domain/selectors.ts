import type { Reservation, Sort, Status } from '../types';
import { normalize } from '../lib/text';
export function selectReservations(
  rows: Reservation[],
  query: string,
  status: Status | 'all',
  sort: Sort,
  date?: string,
): Reservation[] {
  const q = normalize(query);
  return rows
    .filter(
      (r) =>
        (!date || r.date === date) &&
        (status === 'all' || r.status === status) &&
        (!q || normalize(r.name).includes(q) || normalize(r.phone).includes(q)),
    )
    .sort((a, b) =>
      sort === 'time-asc'
        ? a.time.localeCompare(b.time) || a.date.localeCompare(b.date)
        : (a.date + a.time).localeCompare(b.date + b.time) * (sort === 'date-desc' ? -1 : 1),
    );
}

export function reservationCounts(rows: Reservation[], today: string) {
  return {
    all: rows.length,
    today: rows.filter((row) => row.date === today).length,
    confirmed: rows.filter((row) => row.status === 'confirmed').length,
    cancelled: rows.filter((row) => row.status === 'cancelled').length,
    pending: rows.filter((row) => row.status === 'pending').length,
  };
}

export function selectCustomers(rows: Reservation[], query: string) {
  const groups = new Map<
    string,
    { name: string; phone: string; count: number; last: Reservation }
  >();
  for (const row of rows) {
    const existing = groups.get(row.phone);
    const last =
      existing && existing.last.date + existing.last.time > row.date + row.time
        ? existing.last
        : row;
    groups.set(row.phone, {
      name: last.name,
      phone: row.phone,
      count: (existing?.count ?? 0) + 1,
      last,
    });
  }
  const term = normalize(query);
  return [...groups.values()].filter(
    (customer) => normalize(customer.name).includes(term) || customer.phone.includes(term),
  );
}
