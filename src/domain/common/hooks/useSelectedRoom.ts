import { parseAsString, useQueryState } from 'nuqs';

export function useSelectedRoom() {
  const [selectedRoomId, setSelectedRoomId] = useQueryState('roomId', parseAsString.withDefault(''));

  return [selectedRoomId, setSelectedRoomId] as const;
}
