import type { View } from '../types';
interface Props {
  view: View;
  onNavigate: (view: View) => void;
}
export function Sidebar({ view, onNavigate }: Props) {
  return (
    <div className="sidebar-content">
      <div className="brand">نوبت</div>
      <nav aria-label="ناوبری اصلی">
        {(
          [
            { id: 'all', label: 'رزروها' },
            { id: 'today', label: 'رزروهای امروز' },
            { id: 'customers', label: 'مشتریان' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            className={view === item.id ? 'active' : ''}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
