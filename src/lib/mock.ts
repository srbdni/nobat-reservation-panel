import type { Reservation, Status } from '../types';
import { addDays, todayISO } from './date';
import { services } from '../domain/constants';
export function createMockReservations(): Reservation[] {

  const names = [
    'نازنین احمدی',
    'علی محمدی',
    'سارا رضایی',
    'امیرحسین کریمی',
    'مریم حسینی',
    'رضا موسوی',
    'نگار جعفری',
    'محمد صادقی',
    'الهام رحیمی',
    'کیان مرادی',
    'مهسا اکبری',
    'پرهام نادری',
    'شیما شریفی',
    'آرمان کاظمی',
    'هانیه امینی',
    'سینا یوسفی',
  ];
  const statuses: Status[] = [
    'confirmed',
    'pending',
    'confirmed',
    'confirmed',
    'cancelled',
    'pending',
    'confirmed',
    'pending',
    'confirmed',
    'cancelled',
    'confirmed',
    'pending',
    'confirmed',
    'pending',
    'confirmed',
    'cancelled',
  ];

  return names.map((name, i) => ({
    id: `NB-${1041 + i}`,
    name,
    phone: `0912000${String(1100 + i)}`,
    service: services[i % 4],
    date: addDays(todayISO(), i < 6 ? 0 : i < 11 ? 1 : i < 14 ? 2 : -1),
    time: `${String(9 + Math.floor((i % 6) * 1.5)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
    notes: i % 3 === 0 ? 'لطفاً پیش از مراجعه، زمان رزرو با مشتری هماهنگ شود.' : '',
    status: statuses[i],
  }));
}
