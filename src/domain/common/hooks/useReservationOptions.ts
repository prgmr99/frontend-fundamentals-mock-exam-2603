import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function useReservationOptions() {
  const [filters, setFilters] = useQueryStates({
    startTime: parseAsString.withDefault(''),
    endTime: parseAsString.withDefault(''),
    attendees: parseAsInteger.withDefault(1),
    equipment: parseAsArrayOf(parseAsString).withDefault([]),
    floor: parseAsInteger,
  });

  return [filters, setFilters] as const;
}
