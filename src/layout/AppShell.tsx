import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import type { View } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
export function AppShell({
  view,
  onNavigate,
  children,
}: {
  view: View;
  onNavigate: (view: View) => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(next: View) {
    setMobileOpen(false);
    onNavigate(next);
  }

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        رفتن به محتوای اصلی
      </a>
      <aside className="sidebar">
        <Sidebar view={view} onNavigate={navigate} />
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <button
              className="icon-button mobile-menu"
              aria-label="باز کردن فهرست"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>مدیریت مجموعه</span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      {mobileOpen && (
        <Modal title="فهرست" onClose={() => setMobileOpen(false)}>
          <Sidebar view={view} onNavigate={navigate} />
        </Modal>
      )}
    </div>
  );
}
