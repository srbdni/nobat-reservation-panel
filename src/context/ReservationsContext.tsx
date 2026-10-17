import { createContext, useContext, type ReactNode } from 'react';
import { useReservations } from '../hooks/useReservations';
const ReservationsContext = createContext<ReturnType<typeof useReservations> | null>(null);

export function ReservationsProvider({ children }: { children: ReactNode }) {
  const store = useReservations();
  return <ReservationsContext.Provider value={store}>{children}</ReservationsContext.Provider>;
}

export function useReservationStore() {
  const store = useContext(ReservationsContext);
  if (!store) throw new Error('ReservationsProvider is missing');
  return store;
}
