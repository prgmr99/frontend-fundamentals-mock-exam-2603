import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getReservations, createReservation } from 'pages/remotes';
import axios from 'axios';
import { EQUIPMENT_LABELS, TIME_SLOTS, WRAPPER_STYLES } from 'domain/common/constants';
import { getMyReservationQueryOptions, getRoomsQueryOptions } from 'domain/common/queryOptions';
import DateSelect from 'domain/common/components/DateSelect';
import { useDate } from 'domain/common/hooks/useDate';
import LabeledSelectWrapper from 'domain/roomBooking/components/LabeledSelectWrapper';
import ErrorMessageBox from 'domain/roomBooking/components/ErrorMessageBox';
import { useReservationOptions } from 'domain/common/hooks/useReservationOptions';
import { useSelectedRoom } from 'domain/common/hooks/useSelectedRoom';
import { useFloorFilter } from 'domain/common/hooks/useFloorFilter';

const ALL_EQUIPMENT = ['tv', 'whiteboard', 'video', 'speaker'];

const COMMON_LABELED_WRAPPER_CSS = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export function RoomBookingPage() {
  const [filters, setFilters] = useReservationOptions();
  const [, setSelectedRoomId] = useSelectedRoom();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const floors = useFloorFilter();

  // 필터 변경 시 선택 초기화
  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증
  let validationError: string | null = null;
  const hasTimeInputs = filters.startTime !== '' && filters.endTime !== '';
  if (hasTimeInputs) {
    if (filters.endTime <= filters.startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (filters.attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <RoomBookingPage.Header />

      <ErrorMessageBox errorMessage={errorMessage} />

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div css={WRAPPER_STYLES}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        {/* 날짜 */}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            날짜
          </Text>
          <DateSelect onChange={handleFilterChange} />
        </div>
        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <LabeledSelectWrapper
            value={filters.startTime}
            label={'시작 시간'}
            title={
              <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
                시작 시간
              </Text>
            }
            menu={
              <>
                <option value="">선택</option>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </>
            }
            onChange={e => {
              setFilters(prev => ({ ...prev, startTime: e.target.value }));
              handleFilterChange();
            }}
            wrapperCss={COMMON_LABELED_WRAPPER_CSS}
          />
          <LabeledSelectWrapper
            value={filters.endTime}
            label={'종료 시간'}
            title={
              <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
                종료 시간
              </Text>
            }
            menu={
              <>
                <option value="">선택</option>
                {TIME_SLOTS.slice(1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </>
            }
            onChange={e => {
              setFilters(prev => ({ ...prev, endTime: e.target.value }));
              handleFilterChange();
            }}
            wrapperCss={COMMON_LABELED_WRAPPER_CSS}
          />
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
              참석 인원
            </Text>
            <input
              type="number"
              min={1}
              value={filters.attendees}
              onChange={e => {
                setFilters(prev => ({ ...prev, attendees: Math.max(1, Number(e.target.value)) }));
                handleFilterChange();
              }}
              aria-label="참석 인원"
              css={css`
                box-sizing: border-box;
                font-size: 16px;
                font-weight: 500;
                line-height: 1.5;
                height: 48px;
                background-color: ${colors.grey50};
                border-radius: 12px;
                color: ${colors.grey800};
                width: 100%;
                border: 1px solid ${colors.grey200};
                padding: 0 16px;
                outline: none;
                transition: border-color 0.15s;
                &:focus {
                  border-color: ${colors.blue500};
                }
              `}
            />
          </div>
          <LabeledSelectWrapper
            value={filters.floor ?? ''}
            label={'선호 층'}
            title={
              <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
                선호 층
              </Text>
            }
            menu={
              <>
                <option value="">전체</option>
                {floors.map((floor: number) => (
                  <option key={floor} value={floor}>
                    {floor}층
                  </option>
                ))}
              </>
            }
            onChange={e => {
              setFilters(prev => ({ ...prev, floor: Number(e.target.value) }));
              handleFilterChange();
            }}
            wrapperCss={COMMON_LABELED_WRAPPER_CSS}
          />
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <div>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            필요 장비
          </Text>
          <Spacing size={8} />
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(eq => {
              const selectedEquipment = filters.equipment.includes(eq);

              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      equipment: selectedEquipment
                        ? filters.equipment.filter(e => e !== eq)
                        : [...filters.equipment, eq],
                    }));
                    handleFilterChange();
                  }}
                  aria-label={EQUIPMENT_LABELS[eq]}
                  aria-pressed={selectedEquipment}
                  css={css`
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid ${selectedEquipment ? colors.blue500 : colors.grey200};
                    background: ${selectedEquipment ? colors.blue50 : colors.grey50};
                    color: ${selectedEquipment ? colors.blue600 : colors.grey700};
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                    &:hover {
                      border-color: ${selectedEquipment ? colors.blue500 : colors.grey400};
                    }
                  `}
                >
                  {EQUIPMENT_LABELS[eq]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {validationError && (
        <div css={WRAPPER_STYLES}>
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
            role="alert"
          >
            {validationError}
          </span>
        </div>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 - props 개선 */}
      <RoomBookingPage.AvailableRoomsList
        validationError={validationError}
        handleErrorMessage={message => setErrorMessage(message)}
      />

      <Spacing size={24} />
    </div>
  );
}

RoomBookingPage.Header = function Header() {
  const navigate = useNavigate();

  return (
    <>
      <Spacing size={12} />
      <div css={WRAPPER_STYLES}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>
    </>
  );
};

RoomBookingPage.AvailableRoomsList = function AvailableRoomsList({
  validationError,
  handleErrorMessage,
}: {
  validationError: string | null;
  handleErrorMessage: (message: string) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date] = useDate();
  const [filters] = useReservationOptions();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoom();

  const { startTime, endTime, attendees, equipment, floor } = filters;

  const hasTimeInputs = startTime !== '' && endTime !== '';

  const { data: rooms = [] } = useQuery({ ...getRoomsQueryOptions });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      roomId: string;
      date: string;
      start: string;
      end: string;
      attendees: number;
      equipment: string[];
    }) => createReservation(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', variables.date] });
      queryClient.invalidateQueries({ queryKey: getMyReservationQueryOptions.queryKey });
    },
  });

  const isFilterComplete = hasTimeInputs && !validationError;

  const availableRooms = isFilterComplete
    ? rooms
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
        })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      handleErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      handleErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      handleErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      handleErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={WRAPPER_STYLES}>
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>
      <Spacing size={16} />

      {availableRooms.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            조건에 맞는 회의실이 없습니다.
          </Text>
        </div>
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {availableRooms.map(
            (room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={room.name}
                  css={css`
                    cursor: pointer;
                    padding: 14px 16px;
                    border-radius: 14px;
                    border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
                    background: ${isSelected ? colors.blue50 : colors.white};
                    transition: all 0.15s;
                    &:hover {
                      border-color: ${isSelected ? colors.blue500 : colors.grey300};
                    }
                  `}
                >
                  <ListRow
                    contents={
                      <ListRow.Text2Rows
                        top={room.name}
                        topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                        bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                          .map((e: string) => EQUIPMENT_LABELS[e])
                          .join(', ')}`}
                        bottomProps={{ typography: 't7', color: colors.grey600 }}
                      />
                    }
                    right={
                      isSelected ? (
                        <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                          선택됨
                        </Text>
                      ) : undefined
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      )}

      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={createMutation.isPending}>
        {createMutation.isPending ? '예약 중...' : '확정'}
      </Button>
    </div>
  );
};
