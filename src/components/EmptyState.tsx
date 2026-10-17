import type { ReactNode } from 'react';
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <p>{title}</p>
      <div>{children}</div>
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      در حال بارگذاری…
    </div>
  );
}
