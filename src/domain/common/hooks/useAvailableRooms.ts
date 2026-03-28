import { useMemo } from 'react';
import { getAvailableRooms } from '../utils/availableRoomsFilter';
import { getReservations } from 'pages/remotes';
import { useQuery } from '@tanstack/react-query';
import { useReservationOptions } from './useReservationOptions';
import { getRoomsQueryOptions } from '../queryOptions';
import { useDate } from './useDate';

function useAvailableRooms(validationError: string) {
  const [date] = useDate();
  const [filters] = useReservationOptions();

  const { startTime, endTime } = filters;

  const hasTimeInputs = startTime !== '' && endTime !== '';

  const { data: rooms = [] } = useQuery({ ...getRoomsQueryOptions });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

  // ? validationError가 필요할까?
  const isFilterComplete = hasTimeInputs && !validationError;
  const availableRooms = useMemo(() => {
    if (!isFilterComplete || rooms.length === 0) return [];

    return getAvailableRooms({
      rooms,
      reservations,
      date,
      filters,
    });
  }, [
    isFilterComplete,
    rooms,
    reservations,
    date,
    filters.startTime,
    filters.endTime,
    filters.attendees,
    filters.equipment,
    filters.floor,
  ]);

  return availableRooms;
}

export default useAvailableRooms;
