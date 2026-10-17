import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isReservation, validateDraft } from '../src/domain/validation';
import { isValidDate, todayISO } from '../src/lib/date';
import { normalize } from '../src/lib/text';
import { selectReservations } from '../src/domain/selectors';
import type { Reservation, ReservationDraft } from '../src/types';
const now = new Date('2026-10-17T08:00:00+03:30');
const draft: ReservationDraft = {
  name: 'سارا رضایی',
  phone: '09121234567',
  service: 'مشاوره تخصصی',
  date: '2026-10-17',
  time: '12:00',
  notes: '',
};
const row: Reservation = { ...draft, id: 'A', status: 'pending' };
test('accepts a valid draft and Persian phone digits', () => {
  assert.deepEqual(validateDraft(draft, [], now), {});
  assert.deepEqual(validateDraft({ ...draft, phone: '۰۹۱۲۱۲۳۴۵۶۷' }, [], now), {});
});
test('rejects missing fields and malformed dates', () => {
  const errors = validateDraft(
    { ...draft, name: ' ', phone: '123', service: '', date: '2026-02-30', time: '' },
    [],
    now,
  );
  assert.equal(Object.keys(errors).length, 5);
  assert.equal(isValidDate('2026-02-30'), false);
});
test('rejects past dates and elapsed time in Tehran', () => {
  assert.ok(validateDraft({ ...draft, date: '2026-10-16' }, [], now).date);
  assert.ok(validateDraft({ ...draft, time: '07:59' }, [], now).time);
  assert.equal(todayISO(new Date('2026-10-16T21:00:00Z')), '2026-10-17');
});
test('rejects active duplicates but permits replacement of cancellation', () => {
  assert.ok(validateDraft(draft, [row], now).time);
  assert.deepEqual(validateDraft(draft, [{ ...row, status: 'cancelled' }], now), {});
});
test('combines normalized search, date and status', () => {
  const rows = [
    row,
    { ...row, id: 'B', status: 'cancelled' as const },
    { ...row, id: 'C', date: '2026-10-18' },
  ];
  assert.deepEqual(
    selectReservations(rows, 'سارا رضايي', 'pending', 'date-asc', '2026-10-17').map((r) => r.id),
    ['A'],
  );
  assert.equal(selectReservations(rows, '۰۹۱۲', 'all', 'date-asc').length, 3);
  assert.equal(normalize('كيا'), 'کیا');
});
test('sorts by combined date/time or by time and does not mutate source', () => {
  const rows = [
    { ...row, id: 'A', date: '2026-10-18', time: '08:00' },
    { ...row, id: 'B', time: '13:00' },
    { ...row, id: 'C', time: '09:00' },
  ];
  assert.deepEqual(
    selectReservations(rows, '', 'all', 'date-asc').map((r) => r.id),
    ['C', 'B', 'A'],
  );
  assert.deepEqual(
    selectReservations(rows, '', 'all', 'date-desc').map((r) => r.id),
    ['A', 'B', 'C'],
  );
  assert.deepEqual(
    selectReservations(rows, '', 'all', 'time-asc').map((r) => r.id),
    ['A', 'C', 'B'],
  );
  assert.equal(rows[0].id, 'A');
});
test('validates data before trusting browser storage', () => {
  assert.equal(isReservation(row), true);
  assert.equal(isReservation({ ...row, status: 'unknown' }), false);
  assert.equal(isReservation({ ...row, date: 'invalid' }), false);
  assert.equal(isReservation({ ...row, phone: 123 }), false);
  assert.equal(isReservation(null), false);
});
test('returns empty search results and enforces note length', () => {
  assert.equal(selectReservations([row], 'ناشناس', 'all', 'date-asc').length, 0);
  assert.ok(validateDraft({ ...draft, notes: 'x'.repeat(501) }, [], now).notes);
});
