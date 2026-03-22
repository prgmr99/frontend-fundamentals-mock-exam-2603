import { useSearchParams } from 'react-router-dom';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useRef } from 'react';

export function useReservationOptions() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useQueryStates({
    startTime: parseAsString.withDefault(''),
    endTime: parseAsString.withDefault(''),
    attendees: parseAsInteger.withDefault(1),
    equipment: parseAsArrayOf(parseAsString).withDefault([]),
    floor: parseAsInteger,
  });

  const synced = useRef(false);
  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const attendees = searchParams.get('attendees');
    if (startTime || endTime || attendees) {
      setFilters({
        startTime: startTime ?? '',
        endTime: endTime ?? '',
        attendees: attendees ? Number(attendees) : 1,
        equipment: filters.equipment,
        floor: filters.floor,
      });
    }
  }, [searchParams, setFilters, filters.equipment, filters.floor]);

  return [filters, setFilters] as const;
}
