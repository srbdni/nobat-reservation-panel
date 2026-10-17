import { useEffect, useState } from 'react';
import { todayISO } from '../lib/date';
export function useToday() {
  const [today, setToday] = useState(todayISO());

  useEffect(() => {
    const timer = window.setInterval(() => setToday(todayISO()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return today;
}
