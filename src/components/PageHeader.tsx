import { Plus } from 'lucide-react';
export function PageHeader({
  title,
  disabled,
  onNew,
}: {
  title: string;
  disabled: boolean;
  onNew: () => void;
}) {
  return (
    <header className="page-heading">
      <h1>{title}</h1>
      <button className="primary" onClick={onNew} disabled={disabled}>
        <Plus size={17} />
        ثبت رزرو جدید
      </button>
    </header>
  );
}
