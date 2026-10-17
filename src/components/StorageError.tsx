import { useReservationStore } from '../context/ReservationsContext';
import { ResetDataButton } from './ResetDataButton';
export function StorageError() {
  const { error, retry } = useReservationStore();
  if (!error) return null;
  return (
    <div className="error-banner" role="alert">
      <p>{error}</p>
      <button className="text-button" onClick={retry}>
        تلاش مجدد
      </button>
      <ResetDataButton />
    </div>
  );
}
