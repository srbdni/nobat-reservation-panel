import { useState } from 'react';
import type { View } from '../types';
import { AppShell } from './AppShell';
import { StorageError } from '../components/StorageError';
import { CustomersPage } from '../pages/CustomersPage';
import { ReservationsPage } from '../pages/ReservationsPage';
export function Workspace() {
  const [route, setRoute] = useState<{ view: View; date?: string }>({ view: 'all' });
  return (
    <AppShell view={route.view} onNavigate={(view) => setRoute({ view })}>
      <StorageError />
      {route.view === 'customers' ? (
        <CustomersPage />
      ) : (
        <ReservationsPage
          key={`${route.view}:${route.date ?? ''}`}
          todayOnly={route.view === 'today'}
          initialDate={route.date}
          onShowDate={(date) => setRoute({ view: 'all', date })}
        />
      )}
    </AppShell>
  );
}
