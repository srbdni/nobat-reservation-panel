import { useState } from 'react';
import type { Reservation, Status } from '../types';
import { dateLabel } from '../lib/date';
import { faNumber } from '../lib/text';
import { statusLabels } from '../domain/constants';
import { Badge } from './Badge';
import { Modal } from './Modal';
export function ReservationDetails({
  row,
  error,
  onClose,
  onStatus,
}: {
  row: Reservation;
  error?: string;
  onClose: () => void;
  onStatus: (status: Status) => void;
}) {
  const [status, setStatus] = useState(row.status);
  return (
    <Modal title="جزئیات رزرو" subtitle={`شناسه رزرو: ${row.id}`} onClose={onClose}>
      <div className="form-body">
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        <div className="customer-detail">
          <div>
            <h3>{row.name}</h3>
            <a href={`tel:${row.phone}`} dir="ltr">
              {faNumber(row.phone)}
            </a>
          </div>
          <Badge status={row.status} />
        </div>
        <div className="details-grid">
          {[
            { label: 'نوع خدمت', value: row.service },
            { label: 'تاریخ مراجعه', value: dateLabel(row.date, true) },
            { label: 'ساعت مراجعه', value: `${faNumber(row.time)} · تهران` },
            { label: 'شماره تماس', value: faNumber(row.phone) },
          ].map((item) => (
            <div key={item.label}>
              <span>
                {item.label}
                <strong>{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
        <div className="notes-box">
          <span>یادداشت رزرو</span>
          <p>{row.notes || 'توضیحی برای این رزرو ثبت نشده است.'}</p>
        </div>
        <label className="field">
          وضعیت رزرو
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <footer className="modal-footer">
        <button
          className="primary"
          disabled={status === row.status}
          onClick={() => onStatus(status)}
        >
          ذخیره تغییرات
        </button>
        <button className="secondary" onClick={onClose}>
          بستن
        </button>
      </footer>
    </Modal>
  );
}
