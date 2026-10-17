import type { Status } from '../types';
export const services = ['مشاوره تخصصی', 'مراقبت پوست', 'ماساژ و ریلکسیشن', 'خدمات زیبایی'];

export const statusLabels: Record<Status, string> = {
  pending: 'در انتظار تأیید',
  confirmed: 'تأییدشده',
  cancelled: 'لغوشده',
};
