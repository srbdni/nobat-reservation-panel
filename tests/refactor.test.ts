import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Reservation } from '../src/types';
import { createReservation, changeReservationStatus } from '../src/domain/commands';
import { selectCustomers, reservationCounts } from '../src/domain/selectors';
import { serializeReservations } from '../src/services/reservationCsv';
import {
  readReservations,
  writeReservations,
  STORAGE_KEY,
} from '../src/services/reservationStorage';
const row: Reservation = {
  id: 'NB-A',
  name: 'سارا رضایی',
  phone: '09121234567',
  service: 'مشاوره تخصصی',
  date: '2026-10-17',
  time: '12:00',
  notes: '',
  status: 'confirmed',
};

test('creation normalizes input without changing the draft', () => {
  const draft = { ...row, name: ' سارا رضایی ', phone: '۰۹۱۲۱۲۳۴۵۶۷', notes: ' یادداشت ' };
  const result = createReservation(draft, 'NB-B');
  assert.equal(result.id, 'NB-B');
  assert.equal(result.status, 'pending');
  assert.equal(result.phone, row.phone);
  assert.equal(result.name, row.name);
  assert.equal(result.notes, 'یادداشت');
  assert.equal(draft.name, ' سارا رضایی ');
});

test('reactivation rejects duplicate bookings and unknown IDs', () => {
  const cancelled = { ...row, id: 'NB-B', status: 'cancelled' as const };
  assert.equal(changeReservationStatus([row, cancelled], cancelled.id, 'pending').ok, false);
  assert.equal(changeReservationStatus([row], 'missing', 'confirmed').ok, false);
  assert.equal(changeReservationStatus([cancelled], cancelled.id, 'pending').ok, true);
});

test('status changes preserve other reservations and source data', () => {
  const other = { ...row, id: 'NB-B', phone: '09121111111' };
  const result = changeReservationStatus([row, other], row.id, 'cancelled');
  assert.ok(result.ok);
  assert.equal(result.rows[0].status, 'cancelled');
  assert.equal(row.status, 'confirmed');
  assert.equal(result.rows[1], other);
});

test('customer grouping uses phone identity and latest booking name', () => {
  const newer = { ...row, id: 'NB-B', name: 'سارا محمدی', date: '2026-10-18' };
  const customers = selectCustomers([newer, row], '۰۹۱۲');
  assert.equal(customers.length, 1);
  assert.equal(customers[0].count, 2);
  assert.equal(customers[0].name, newer.name);
  assert.equal(customers[0].last.id, newer.id);
  assert.deepEqual(reservationCounts([row, newer], row.date), {
    all: 2,
    today: 1,
    confirmed: 2,
    pending: 0,
    cancelled: 0,
  });
});

test('CSV preserves quoted cells and neutralizes spreadsheet formulas', () => {
  const csv = serializeReservations([{ ...row, name: ' =HYPERLINK("x")' }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.equal(csv.split('\r\n').length, 2);
  assert.ok(csv.includes('"\' =HYPERLINK(""x"")"'));
  assert.ok(csv.includes('"تأییدشده"'));
});

test('storage round-trip preserves the existing key and empty lists', () => {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
  };
  assert.equal(readReservations(storage), null);
  writeReservations(storage, [row]);
  assert.ok(memory.has(STORAGE_KEY));
  assert.deepEqual(readReservations(storage), [row]);
  writeReservations(storage, []);
  assert.deepEqual(readReservations(storage), []);
});

test('storage rejects corrupt data and duplicate IDs without rewriting it', () => {
  for (const raw of [
    '{broken',
    JSON.stringify([row, row]),
    JSON.stringify([{ ...row, status: 'bad' }]),
  ]) {
    assert.throws(() => readReservations({ getItem: () => raw }));
  }
  assert.throws(() =>
    writeReservations(
      {
        setItem: () => {
          throw new Error('quota');
        },
      },
      [row],
    ),
  );
});
