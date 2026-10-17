import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
type Notice = { text: string; kind: 'success' | 'error' };

const NotificationsContext = createContext<((notice: Notice) => void) | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <NotificationsContext.Provider value={setNotice}>
      {children}
      {notice && (
        <div className={`toast ${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>
          <span>{notice.text}</span>
          <button aria-label="بستن اعلان" onClick={() => setNotice(null)}>
            <X size={17} />
          </button>
        </div>
      )}
    </NotificationsContext.Provider>
  );
}
export function useNotify() {
  const notify = useContext(NotificationsContext);
  if (!notify) throw new Error('NotificationsProvider is missing');
  return notify;
}
