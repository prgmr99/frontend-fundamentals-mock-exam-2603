import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getRooms } from 'pages/remotes';

export const getRoomsQueryOptions = queryOptions({
  queryKey: ['rooms'],
  queryFn: getRooms,
});

export const getMyReservationQueryOptions = queryOptions({
  queryKey: ['myReservations'],
  queryFn: getMyReservations,
});
