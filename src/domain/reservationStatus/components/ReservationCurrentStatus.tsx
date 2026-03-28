import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, TIME_SLOTS, WRAPPER_STYLES } from 'domain/common/constants';
import { useDate } from 'domain/common/hooks/useDate';
import { getRoomsQueryOptions } from 'domain/common/queryOptions';
import { getReservations } from 'pages/remotes';
import { useState } from 'react';

const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
const TIMELINE_START = 9;
const TIMELINE_END = 20;
const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

function ReservationCurrentStatus() {
  // TODO: queryOptions 활용 + useSuspenseQuery로 교체
  const { data: rooms = [] } = useQuery({ ...getRoomsQueryOptions });

  return (
    <div
      css={css`
        background: ${colors.grey50};
        border-radius: 14px;
        padding: 16px;
      `}
    >
      {/* 시간 헤더 */}
      <div
        css={css`
          display: flex;
          align-items: flex-end;
          margin-bottom: 8px;
        `}
      >
        <div
          css={css`
            width: 80px;
            flex-shrink: 0;
            padding-right: 8px;
          `}
        />
        <div
          css={css`
            flex: 1;
            position: relative;
            height: 18px;
          `}
        >
          {HOUR_LABELS.map(t => {
            const left = (timeToMinutes(t) / TOTAL_MINUTES) * 100;
            return (
              <Text
                key={t}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={css`
                  position: absolute;
                  left: ${left}%;
                  transform: translateX(-50%);
                  font-size: 10px;
                  letter-spacing: -0.3px;
                `}
              >
                {t.slice(0, 2)}
              </Text>
            );
          })}
        </div>
      </div>

      {/* 회의실별 타임라인 */}
      {rooms.map((room: { id: string; name: string }, index: number) => (
        <RoomTimeline room={room} index={index} />
      ))}
    </div>
  );
}

export default ReservationCurrentStatus;

function RoomTimeline({ room, index }: { room: { id: string; name: string }; index: number }) {
  const [date] = useDate();
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

  const roomReservations = reservations.filter((r: { roomId: string }) => r.roomId === room.id);

  return (
    <div
      key={room.id}
      css={css`
        display: flex;
        align-items: center;
        height: 32px;
        ${index > 0 ? 'margin-top: 4px;' : ''}
      `}
    >
      <div
        css={css`
          width: 80px;
          flex-shrink: 0;
          padding-right: 8px;
        `}
      >
        <Text
          typography="t7"
          fontWeight="medium"
          color={colors.grey700}
          ellipsisAfterLines={1}
          css={css`
            font-size: 12px;
          `}
        >
          {room.name}
        </Text>
      </div>
      <div
        css={css`
          flex: 1;
          height: 24px;
          background: ${colors.white};
          border-radius: 6px;
          position: relative;
          overflow: visible;
        `}
      >
        {roomReservations.map(
          (reservation: { id: string; start: string; end: string; attendees: number; equipment: string[] }) => (
            <RoomReservationCard
              id={`${reservation.id} - ${room.name}`}
              start={reservation.start}
              end={reservation.end}
              attendees={reservation.attendees}
              equipment={reservation.equipment}
            />
          )
        )}
      </div>
    </div>
  );
}

function RoomReservationCard(reservation: {
  id: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}) {
  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const left = (timeToMinutes(reservation.start) / TOTAL_MINUTES) * 100;
  const width = ((timeToMinutes(reservation.end) - timeToMinutes(reservation.start)) / TOTAL_MINUTES) * 100;
  const isActive = activeReservation === reservation.id;

  return (
    <div
      key={reservation.id}
      css={css`
        position: absolute;
        left: ${left}%;
        width: ${width}%;
        height: 100%;
      `}
    >
      <div
        role="button"
        aria-label={`${reservation.id} ${reservation.start}-${reservation.end} 예약 상세`}
        onClick={() => setActiveReservation(isActive ? null : reservation.id)}
        css={css`
          width: 100%;
          height: 100%;
          background: ${colors.blue400};
          border-radius: 4px;
          opacity: ${isActive ? 1 : 0.75};
          cursor: pointer;
          transition: opacity 0.15s;
          &:hover {
            opacity: 1;
          }
        `}
      />

      {isActive && (
        <div
          role="tooltip"
          css={css`
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            background: ${colors.grey900};
            color: ${colors.white};
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
            line-height: 1.6;
          `}
        >
          <div>
            {reservation.start} ~ {reservation.end}
          </div>
          <div>{reservation.attendees}명</div>
          {reservation.equipment.length > 0 && (
            <div>{reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
}
