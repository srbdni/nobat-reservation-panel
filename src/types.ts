export type Status = 'pending' | 'confirmed' | 'cancelled';
export type View = 'all' | 'today' | 'customers';
export type Sort = 'date-asc' | 'date-desc' | 'time-asc';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: Status;
}

export type ReservationDraft = Omit<Reservation, 'id' | 'status'>;
export type FormErrors = Partial<Record<keyof ReservationDraft, string>>;
