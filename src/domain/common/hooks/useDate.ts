import { useQueryState } from 'nuqs';
import { formatDate } from '../utils';

export function useDate() {
  const [date, setDate] = useQueryState('date', { defaultValue: formatDate(new Date()) });

  return [date, setDate] as const;
}
