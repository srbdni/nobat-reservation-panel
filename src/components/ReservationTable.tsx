import { ArrowUpDown } from 'lucide-react';
import type { Reservation, Sort } from '../types';
import { dateLabel } from '../lib/date';
import { faNumber } from '../lib/text';
import { Badge } from './Badge';
interface Props {
  rows: Reservation[];
  today: string;
  sort: Sort;
  onSort: (sort: Sort) => void;
  onDetails: (id: string) => void;
}
export function ReservationTable({ rows, today, sort, onSort, onDetails }: Props) {
  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">رزروها</caption>
        <thead>
          <tr>
            <th scope="col">مشتری</th>
            <th scope="col">شماره تماس</th>
            <th scope="col">خدمت</th>
            <th
              scope="col"
              aria-sort={
                sort === 'date-asc' ? 'ascending' : sort === 'date-desc' ? 'descending' : 'none'
              }
            >
              <button
                className="table-sort"
                onClick={() => onSort(sort === 'date-asc' ? 'date-desc' : 'date-asc')}
              >
                تاریخ
                <ArrowUpDown size={13} />
              </button>
            </th>
            <th scope="col" aria-sort={sort === 'time-asc' ? 'ascending' : 'none'}>
              <button className="table-sort" onClick={() => onSort('time-asc')}>
                ساعت
                <ArrowUpDown size={13} />
              </button>
            </th>
            <th scope="col">وضعیت</th>
            <th scope="col">
              <span className="sr-only">عملیات</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <button className="customer-name" onClick={() => onDetails(row.id)}>
                  {row.name}
                </button>
              </td>
              <td>
                <span className="phone" dir="ltr">
                  {faNumber(row.phone)}
                </span>
              </td>
              <td>{row.service}</td>
              <td>
                {dateLabel(row.date)}
                {row.date === today && <small className="today-label">امروز</small>}
              </td>
              <td>
                <span dir="ltr">{faNumber(row.time)}</span>
              </td>
              <td>
                <Badge status={row.status} />
              </td>
              <td>
                <button
                  className="text-button"
                  onClick={() => onDetails(row.id)}
                  aria-label={`جزئیات رزرو ${row.name}`}
                >
                  جزئیات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
