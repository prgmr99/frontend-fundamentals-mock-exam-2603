import { useQuery } from '@tanstack/react-query';
import { getRoomsQueryOptions } from '../queryOptions';

export function useFloorFilter() {
  const { data: rooms = [] } = useQuery({ ...getRoomsQueryOptions });

  return [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);
}
