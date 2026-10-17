import { ReservationsProvider } from './context/ReservationsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { Workspace } from './layout/Workspace';

export default function App() {
  return (
    <ReservationsProvider>
      <NotificationsProvider>
        <Workspace />
      </NotificationsProvider>
    </ReservationsProvider>
  );
}
