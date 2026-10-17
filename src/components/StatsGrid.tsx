import { faNumber } from '../lib/text';
import type { reservationCounts } from '../domain/selectors';
export function StatsGrid({
  counts,
  loading,
}: {
  counts: ReturnType<typeof reservationCounts>;
  loading: boolean;
}) {
  return (
    <dl className="stats-grid" aria-label="آمار رزروها">
      {[
        { label: 'کل رزروها', value: counts.all },
        { label: 'امروز', value: counts.today },
        { label: 'تأییدشده', value: counts.confirmed },
        { label: 'لغوشده', value: counts.cancelled },
      ].map((item) => (
        <div className="stat" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{loading ? '—' : faNumber(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
