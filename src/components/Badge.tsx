import type { Status } from '../types';
import { statusLabels } from '../domain/constants';
export function Badge({ status }: { status: Status }) {
  return <span className={`badge ${status}`}>{statusLabels[status]}</span>;
}
