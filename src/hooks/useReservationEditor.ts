import { useState } from 'react';
import type { ReservationDraft, Status } from '../types';
import { useReservationStore } from '../context/ReservationsContext';
import { useNotify } from '../context/NotificationsContext';
type EditorState = { mode: 'closed' } | { mode: 'create' } | { mode: 'details'; id: string };

export function useReservationEditor(onCreated?: (draft: ReservationDraft) => void) {
  const store = useReservationStore();
  const notify = useNotify();
  const [state, setState] = useState<EditorState>({ mode: 'closed' });
  const [error, setError] = useState('');

  function close() {
    setState({ mode: 'closed' });
    setError('');
  }

  function create() {
    setError('');
    setState({ mode: 'create' });
  }

  function details(id: string) {
    setError('');
    setState({ mode: 'details', id });
  }

  function save(draft: ReservationDraft) {
    const result = store.add(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    close();
    notify({
      text: result.persisted ? 'رزرو ثبت شد.' : 'رزرو ثبت شد؛ ذخیره‌سازی مرورگر انجام نشد.',
      kind: result.persisted ? 'success' : 'error',
    });
    onCreated?.(draft);
  }

  function updateStatus(status: Status) {
    if (state.mode !== 'details') return;
    const result = store.updateStatus(state.id, status);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    close();
    notify({
      text: result.persisted
        ? 'وضعیت رزرو تغییر کرد.'
        : 'وضعیت تغییر کرد؛ ذخیره‌سازی مرورگر انجام نشد.',
      kind: result.persisted ? 'success' : 'error',
    });
  }

  return {
    state,
    error,
    close,
    create,
    details,
    save,
    updateStatus,
    rows: store.rows,
    selected: state.mode === 'details' ? store.rows.find((row) => row.id === state.id) : undefined,
  };
}
