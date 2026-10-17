import { ChevronLeft, ChevronRight } from 'lucide-react';
import { faNumber } from '../lib/text';
interface Props {
  total: number;
  page: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}
export function Pagination({ total, page, pageSize, onPage, onPageSize }: Props) {
  const start = (page - 1) * pageSize;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <footer className="pagination">
      <span>
        {faNumber(start + 1)} تا {faNumber(Math.min(start + pageSize, total))} از {faNumber(total)}{' '}
        رزرو
      </span>
      <div className="page-controls">
        <label>
          تعداد در صفحه
          <select
            aria-label="تعداد رزرو در هر صفحه"
            value={pageSize}
            onChange={(event) => onPageSize(Number(event.target.value))}
          >
            <option value={12}>۱۲</option>
            <option value={24}>۲۴</option>
          </select>
        </label>
        <button
          className="icon-button"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          aria-label="صفحه قبل"
        >
          <ChevronRight size={17} />
        </button>
        <span>
          {faNumber(page)} / {faNumber(pages)}
        </span>
        <button
          className="icon-button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          aria-label="صفحه بعد"
        >
          <ChevronLeft size={17} />
        </button>
      </div>
    </footer>
  );
}
