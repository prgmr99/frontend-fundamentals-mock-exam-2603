import { Reservation, Room } from '_tosslib/server/types';

interface FilterParams {
  rooms: Room[];
  reservations: Reservation[];
  date: string;
  filters: {
    startTime: string;
    endTime: string;
    attendees: number;
    equipment: string[];
    floor: number | null;
  };
}

export const getAvailableRooms = ({ rooms, reservations, date, filters }: FilterParams) => {
  const { startTime, endTime, attendees, equipment, floor } = filters;

  return (
    rooms
      .filter((room: { id: string; capacity: number; equipment: string[]; floor: number }) => {
        if (room.capacity < attendees) return false;
        if (!equipment.every(eq => room.equipment.includes(eq))) return false;
        if (floor !== null && room.floor !== floor) return false;
        const hasConflict = reservations.some(
          (r: { roomId: string; date: string; start: string; end: string }) =>
            r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
        );
        if (hasConflict) return false;
        return true;
      })
      .sort((a: { floor: number; name: string }, b: { floor: number; name: string }) => {
        if (a.floor !== b.floor) return a.floor - b.floor;
        return a.name.localeCompare(b.name);
      }) ?? []
  );
};
