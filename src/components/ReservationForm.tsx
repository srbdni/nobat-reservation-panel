import { useState, type FormEvent } from 'react';
import { Modal } from './Modal';
import { normalize } from '../lib/text';
import { services } from '../domain/constants';
import { todayISO } from '../lib/date';
import { validateDraft } from '../domain/validation';
import type { FormErrors, Reservation, ReservationDraft } from '../types';
export function ReservationForm({
  rows,
  error,
  onClose,
  onSave,
}: {
  rows: Reservation[];
  error?: string;
  onClose: () => void;
  onSave: (draft: ReservationDraft) => void;
}) {
  const [draft, setDraft] = useState<ReservationDraft>({
    name: '',
    phone: '',
    service: '',
    date: todayISO(),
    time: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  function field(key: keyof ReservationDraft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problems = validateDraft(draft, rows);
    setErrors(problems);
    const first = Object.keys(problems)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      phone: normalize(draft.phone),
      notes: draft.notes.trim(),
    });
  }
  const attrs = (key: keyof ReservationDraft) => ({
    id: key,
    name: key,
    required: key !== 'notes',
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });
  const err = (key: keyof ReservationDraft) =>
    errors[key] && (
      <span id={`${key}-error`} className="field-error" role="alert">
        {errors[key]}
      </span>
    );
  return (
    <Modal
      title="ثبت رزرو جدید"
      subtitle="اطلاعات مشتری و زمان مراجعه را وارد کنید."
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate>
        <div className="form-body">
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-grid">
            <label className="field">
              نام و نام خانوادگی <span className="required">*</span>
              <input
                {...attrs('name')}
                autoFocus
                autoComplete="name"
                placeholder="مثلاً نازنین احمدی"
                value={draft.name}
                maxLength={70}
                onChange={(e) => field('name', e.target.value)}
              />
              {err('name')}
            </label>
            <label className="field">
              شماره موبایل <span className="required">*</span>
              <input
                {...attrs('phone')}
                type="tel"
                dir="ltr"
                autoComplete="tel-national"
                inputMode="tel"
                placeholder="09121234567"
                value={draft.phone}
                maxLength={11}
                onChange={(e) => field('phone', e.target.value)}
              />
              {err('phone')}
            </label>
            <label className="field full">
              نوع خدمت <span className="required">*</span>
              <select
                {...attrs('service')}
                value={draft.service}
                onChange={(e) => field('service', e.target.value)}
              >
                <option value="">خدمت مورد نظر را انتخاب کنید</option>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {err('service')}
            </label>
            <label className="field">
              تاریخ رزرو (میلادی) <span className="required">*</span>
              <input
                {...attrs('date')}
                type="date"
                min={todayISO()}
                value={draft.date}
                onChange={(e) => field('date', e.target.value)}
              />
              {err('date')}
            </label>
            <label className="field">
              ساعت مراجعه (تهران) <span className="required">*</span>
              <input
                {...attrs('time')}
                type="time"
                value={draft.time}
                onChange={(e) => field('time', e.target.value)}
              />
              {err('time')}
            </label>
            <label className="field full">
              توضیحات <small>اختیاری</small>
              <textarea
                {...attrs('notes')}
                placeholder="نکته‌ای درباره این رزرو بنویسید…"
                rows={3}
                maxLength={500}
                value={draft.notes}
                onChange={(e) => field('notes', e.target.value)}
              />
              {err('notes')}
            </label>
          </div>
          <p className="form-note">رزرو جدید با وضعیت «در انتظار تأیید» ثبت می‌شود.</p>
        </div>
        <footer className="modal-footer">
          <button className="primary" type="submit">
            ثبت رزرو
          </button>
          <button className="secondary" type="button" onClick={onClose}>
            انصراف
          </button>
        </footer>
      </form>
    </Modal>
  );
}
