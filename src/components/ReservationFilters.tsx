import type { ReservationFilters as Filters } from '../hooks/useReservationFilters';
import type { Sort } from '../types';
import { statusLabels } from '../domain/constants';
import { addDays, dateLabel } from '../lib/date';
import { SearchField } from './SearchField';
interface Props {
  filters: Filters;
  today: string;
  todayOnly: boolean;
  onChange: (patch: Partial<Filters>) => void;
}
export function ReservationFilters({ filters, today, todayOnly, onChange }: Props) {
  return (
    <>
      <div className="status-tabs" role="group" aria-label="فیلتر وضعیت">
        {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            aria-pressed={filters.status === status}
            className={filters.status === status ? 'selected' : ''}
            onClick={() => onChange({ status })}
          >
            {status === 'all' ? 'همه' : statusLabels[status]}
          </button>
        ))}
      </div>
      <div className="filters">
        <SearchField value={filters.query} onChange={(query) => onChange({ query })} />
        <div className="filter-selects">
          {!todayOnly && (
            <label className="filter-control">
              <span>تاریخ</span>
              <select
                aria-label="فیلتر تاریخ"
                value={filters.date}
                onChange={(event) => onChange({ date: event.target.value })}
              >
                <option value="">همه تاریخ‌ها</option>
                <option value={today}>امروز</option>
                <option value={addDays(today, 1)}>فردا</option>
                {filters.date && filters.date !== today && filters.date !== addDays(today, 1) && (
                  <option value={filters.date}>{dateLabel(filters.date)}</option>
                )}
              </select>
            </label>
          )}
          <label className="filter-control">
            <span>ترتیب</span>
            <select
              aria-label="مرتب‌سازی رزروها"
              value={filters.sort}
              onChange={(event) => onChange({ sort: event.target.value as Sort })}
            >
              <option value="date-asc">تاریخ صعودی</option>
              <option value="date-desc">تاریخ نزولی</option>
              <option value="time-asc">ساعت مراجعه</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}
