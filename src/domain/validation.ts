import type { FormErrors, Reservation, ReservationDraft } from '../types';
import { services } from './constants';
import { normalize } from '../lib/text';
import { todayISO, isValidDate } from '../lib/date';
export function validateDraft(
  draft: ReservationDraft,
  reservations: Reservation[],
  now = new Date(),
): FormErrors {
  const errors: FormErrors = {};
  if (draft.name.trim().length < 3 || draft.name.trim().length > 70)
    errors.name = 'نام مشتری باید بین ۳ تا ۷۰ کاراکتر باشد.';

  if (!/^09\d{9}$/.test(normalize(draft.phone)))
    errors.phone = 'شماره موبایل معتبر ۱۱ رقمی وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷.';

  if (!services.includes(draft.service)) errors.service = 'نوع خدمت را انتخاب کنید.';

  if (!isValidDate(draft.date)) errors.date = 'تاریخ معتبر انتخاب کنید.';
  else if (draft.date < todayISO(now)) errors.date = 'تاریخ رزرو نمی‌تواند در گذشته باشد.';

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)) errors.time = 'ساعت معتبر انتخاب کنید.';
  else if (!errors.date && new Date(`${draft.date}T${draft.time}:00+03:30`) <= now)
    errors.time = 'زمان رزرو باید بعد از زمان فعلی باشد (به وقت تهران).';

  if (draft.notes.length > 500) errors.notes = 'توضیحات حداکثر ۵۰۰ کاراکتر است.';
  if (
    !errors.phone &&
    !errors.date &&
    !errors.time &&
    reservations.some(
      (r) =>
        r.status !== 'cancelled' &&
        r.phone === normalize(draft.phone) &&
        r.date === draft.date &&
        r.time === draft.time,
    )
  )
    errors.time = 'این مشتری در همین تاریخ و ساعت رزرو فعال دارد.';
  return errors;
}

export function isReservation(value: unknown): value is Reservation {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    ['id', 'name', 'phone', 'service', 'date', 'time', 'notes', 'status'].every(
      (key) => typeof r[key] === 'string',
    ) &&
    !!r.id &&
    isValidDate(r.date as string) &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(r.time as string) &&
    /^09\d{9}$/.test(r.phone as string) &&
    services.includes(r.service as string) &&
    ['pending', 'confirmed', 'cancelled'].includes(r.status as string)
  );
}
