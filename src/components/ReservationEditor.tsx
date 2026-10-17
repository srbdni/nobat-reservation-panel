import type { useReservationEditor } from '../hooks/useReservationEditor';
import { ReservationForm } from './ReservationForm';
import { ReservationDetails } from './ReservationDetails';
export function ReservationEditor({ editor }: { editor: ReturnType<typeof useReservationEditor> }) {
  if (editor.state.mode === 'create')
    return (
      <ReservationForm
        rows={editor.rows}
        error={editor.error}
        onClose={editor.close}
        onSave={editor.save}
      />
    );
  if (editor.selected)
    return (
      <ReservationDetails
        row={editor.selected}
        error={editor.error}
        onClose={editor.close}
        onStatus={editor.updateStatus}
      />
    );
  return null;
}
