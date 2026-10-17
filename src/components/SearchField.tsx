import { Search, X } from 'lucide-react';
export function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <Search size={17} />
      <input
        aria-label="جست‌وجوی مشتری"
        placeholder="نام یا شماره تماس"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button aria-label="پاک کردن جست‌وجو" onClick={() => onChange('')}>
          <X size={16} />
        </button>
      )}
    </label>
  );
}
