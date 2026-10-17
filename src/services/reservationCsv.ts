import type { Reservation } from '../types';
import { statusLabels } from '../domain/constants';
function escapeCell(value: string) {
  const safe = /^[\s]*[=+@\-\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function serializeReservations(rows: Reservation[]) {
  const data = [
    ['شناسه', 'نام مشتری', 'شماره تماس', 'خدمت', 'تاریخ میلادی', 'ساعت', 'وضعیت'],
    ...rows.map((row) => [
      row.id,
      row.name,
      row.phone,
      row.service,
      row.date,
      row.time,
      statusLabels[row.status],
    ]),
  ];
  return '\uFEFF' + data.map((row) => row.map(escapeCell).join(',')).join('\r\n');
}
export function downloadReservations(rows: Reservation[], date: string) {
  const url = URL.createObjectURL(
    new Blob([serializeReservations(rows)], { type: 'text/csv;charset=utf-8;' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `nobat-${date}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
