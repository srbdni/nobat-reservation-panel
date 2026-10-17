import type { ReservationDraft } from '../types';
import { useReservationStore } from '../context/ReservationsContext';
import { useNotify } from '../context/NotificationsContext';
import { useReservationFilters } from '../hooks/useReservationFilters';
import { useReservationEditor } from '../hooks/useReservationEditor';
import { useToday } from '../hooks/useToday';
import { reservationCounts } from '../domain/selectors';
import { downloadReservations } from '../services/reservationCsv';
import { faNumber } from '../lib/text';
import { ReservationEditor } from '../components/ReservationEditor';
import { ReservationFilters } from '../components/ReservationFilters';
import { ReservationTable } from '../components/ReservationTable';
import { StatsGrid } from '../components/StatsGrid';
import { Pagination } from '../components/Pagination';
import { PageHeader } from '../components/PageHeader';
import { EmptyState, LoadingState } from '../components/EmptyState';
interface Props {
  todayOnly: boolean;
  initialDate?: string;
  onShowDate: (date: string) => void;
}
export function ReservationsPage({ todayOnly, initialDate, onShowDate }: Props) {
  const { rows, loading, readFailed } = useReservationStore();
  const today = useToday();
  const notify = useNotify();
  const list = useReservationFilters(rows, todayOnly ? today : undefined, initialDate);
  function onCreated(draft: ReservationDraft) {
    if (todayOnly && draft.date !== today) onShowDate(draft.date);
    else list.showDate(draft.date);
  }
  const editor = useReservationEditor(onCreated);
  function exportCsv() {
    try {
      downloadReservations(list.filtered, today);
      notify({ text: 'فایل خروجی آماده شد.', kind: 'success' });
    } catch {
      notify({ text: 'دریافت خروجی انجام نشد. دوباره تلاش کنید.', kind: 'error' });
    }
  }
  const visible = list.filtered.slice((list.page - 1) * list.pageSize, list.page * list.pageSize);
  return (
    <>
      <PageHeader
        title={todayOnly ? 'رزروهای امروز' : 'رزروها'}
        disabled={loading || readFailed}
        onNew={editor.create}
      />
      <StatsGrid counts={reservationCounts(rows, today)} loading={loading} />
      <section className="reservations-panel" aria-label="فهرست رزروها">
        <div className="panel-heading">
          <h2>
            فهرست رزروها <span className="count-label">({faNumber(list.filtered.length)})</span>
          </h2>
          <button
            className="secondary small-button"
            onClick={exportCsv}
            disabled={loading || !list.filtered.length}
          >
            خروجی CSV
          </button>
        </div>
        <ReservationFilters
          filters={list.filters}
          today={today}
          todayOnly={todayOnly}
          onChange={list.change}
        />
        {loading ? (
          <LoadingState />
        ) : list.filtered.length ? (
          <>
            <ReservationTable
              rows={visible}
              today={today}
              sort={list.filters.sort}
              onSort={(sort) => list.change({ sort })}
              onDetails={editor.details}
            />
            <Pagination
              total={list.filtered.length}
              page={list.page}
              pageSize={list.pageSize}
              onPage={list.setPage}
              onPageSize={list.setPageSize}
            />
          </>
        ) : (
          <EmptyState title="رزروی پیدا نشد.">
            <button className="secondary" onClick={list.clear}>
              پاک کردن فیلترها
            </button>
            <button className="primary" disabled={readFailed} onClick={editor.create}>
              ثبت رزرو
            </button>
          </EmptyState>
        )}
      </section>
      <ReservationEditor editor={editor} />
    </>
  );
}
