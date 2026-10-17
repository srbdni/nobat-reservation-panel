import { useMemo, useState } from 'react';
import { useReservationStore } from '../context/ReservationsContext';
import { useReservationEditor } from '../hooks/useReservationEditor';
import { selectCustomers } from '../domain/selectors';
import { dateLabel } from '../lib/date';
import { faNumber } from '../lib/text';
import { ReservationEditor } from '../components/ReservationEditor';
import { PageHeader } from '../components/PageHeader';
import { SearchField } from '../components/SearchField';
import { EmptyState, LoadingState } from '../components/EmptyState';
export function CustomersPage() {
  const { rows, loading, readFailed } = useReservationStore();
  const [query, setQuery] = useState('');
  const editor = useReservationEditor(() => setQuery(''));
  const customers = useMemo(() => selectCustomers(rows, query), [rows, query]);
  return (
    <>
      <PageHeader title="مشتریان" disabled={loading || readFailed} onNew={editor.create} />
      <section className="reservations-panel" aria-label="فهرست مشتریان">
        <div className="panel-heading">
          <h2>
            فهرست مشتریان <span className="count-label">({faNumber(customers.length)})</span>
          </h2>
        </div>
        <div className="filters">
          <SearchField value={query} onChange={setQuery} />
        </div>
        {loading ? (
          <LoadingState />
        ) : customers.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">نام مشتری</th>
                  <th scope="col">شماره تماس</th>
                  <th scope="col">تعداد رزرو</th>
                  <th scope="col">آخرین تاریخ رزرو</th>
                  <th scope="col">
                    <span className="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.phone}>
                    <td>{customer.name}</td>
                    <td>
                      <span dir="ltr">{faNumber(customer.phone)}</span>
                    </td>
                    <td>{faNumber(customer.count)}</td>
                    <td>{dateLabel(customer.last.date)}</td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => editor.details(customer.last.id)}
                      >
                        آخرین رزرو
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="مشتری‌ای پیدا نشد.">
            <button className="secondary" onClick={() => setQuery('')}>
              پاک کردن جست‌وجو
            </button>
          </EmptyState>
        )}
      </section>
      <ReservationEditor editor={editor} />
    </>
  );
}
