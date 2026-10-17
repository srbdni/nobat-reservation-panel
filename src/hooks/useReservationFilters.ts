import { useMemo, useState } from 'react';
import type { Reservation, Sort, Status } from '../types';
import { selectReservations } from '../domain/selectors';
export interface ReservationFilters {
  query: string;
  status: Status | 'all';
  sort: Sort;
  date: string;
}

const defaults: ReservationFilters = { query: '', status: 'all', sort: 'date-asc', date: '' };

export function useReservationFilters(rows: Reservation[], scopeDate?: string, initialDate = '') {
  const [filters, setFilters] = useState({ ...defaults, date: initialDate });
  const [page, setPage] = useState(1);
  const [pageSize, setSize] = useState(12);
  const filtered = useMemo(
    () =>
      selectReservations(
        rows,
        filters.query,
        filters.status,
        filters.sort,
        scopeDate || filters.date,
      ),
    [rows, filters, scopeDate],
  );

  function change(patch: Partial<ReservationFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }

  function clear() {
    setFilters(defaults);
    setPage(1);
  }

  function showDate(date: string) {
    setFilters({ ...defaults, date });
    setPage(1);
  }
  function setPageSize(size: number) {
    setSize(size);
    setPage(1);
  }

  return {
    filters,
    filtered,
    change,
    clear,
    showDate,
    page: Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize))),
    pageSize,
    setPage,
    setPageSize,
  };
}
