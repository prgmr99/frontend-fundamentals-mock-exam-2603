import { useQueryState } from 'nuqs';
import { formatDate } from '../utils/formateDate';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export function useDate() {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useQueryState('date', { defaultValue: formatDate(new Date()) });

  useEffect(() => {
    if (searchParams.get('date')) {
      setDate(searchParams.get('date'));
    }
  }, []);

  return [date, setDate] as const;
}
