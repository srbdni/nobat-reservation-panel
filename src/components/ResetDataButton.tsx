import { useState } from 'react';
import { useReservationStore } from '../context/ReservationsContext';
import { useNotify } from '../context/NotificationsContext';
import { Modal } from './Modal';
export function ResetDataButton({ onComplete }: { onComplete?: () => void }) {
  const [open, setOpen] = useState(false);
  const { reset } = useReservationStore();
  const notify = useNotify();
  function confirm() {
    const result = reset();
    setOpen(false);
    onComplete?.();
    notify({
      text:
        result.ok && result.persisted
          ? 'داده‌های نمونه جایگزین شدند.'
          : 'داده‌ها جایگزین شدند؛ ذخیره‌سازی مرورگر انجام نشد.',
      kind: result.ok && result.persisted ? 'success' : 'error',
    });
  }
  return (
    <>
      <button className="text-button" onClick={() => setOpen(true)}>
        بازیابی داده‌های نمونه
      </button>
      {open && (
        <Modal title="بازیابی داده‌های نمونه" onClose={() => setOpen(false)}>
          <div className="form-body">
            <p>
              رزروها و تغییرات فعلی حذف و با ۱۶ رزرو نمونه جایگزین می‌شوند. این کار قابل بازگشت
              نیست.
            </p>
          </div>
          <footer className="modal-footer">
            <button className="danger" onClick={confirm}>
              حذف و جایگزینی
            </button>
            <button className="secondary" onClick={() => setOpen(false)}>
              انصراف
            </button>
          </footer>
        </Modal>
      )}
    </>
  );
}
