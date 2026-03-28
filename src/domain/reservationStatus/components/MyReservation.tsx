import { css } from '@emotion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, ListRow, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, WRAPPER_STYLES } from 'domain/common/constants';
import { getMyReservationQueryOptions, getRoomsQueryOptions } from 'domain/common/queryOptions';
import { cancelReservation } from 'pages/remotes';

function MyReservation({
  onCancelResult,
}: {
  onCancelResult: (message: { type: 'success' | 'error'; text: string }) => void;
}) {
  const queryClient = useQueryClient();

  // TODO: useSuspenseQuery로 교체
  const { data: rooms = [] } = useQuery({ ...getRoomsQueryOptions });
  const { data: myReservationList = [] } = useQuery({ ...getMyReservationQueryOptions });

  const { mutateAsync: cancelMutateAsync } = useMutation({
    mutationFn: (id: string) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: getMyReservationQueryOptions.queryKey });
      onCancelResult({ type: 'success', text: '예약이 취소되었습니다.' });
    },
    onError: () => {
      onCancelResult({ type: 'error', text: '취소에 실패했습니다.' });
    },
  });

  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <div>
      {myReservationList.length === 0 ? (
        <MyReservation.Empty />
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {myReservationList.map(
            (res: {
              id: string;
              roomId: string;
              date: string;
              start: string;
              end: string;
              attendees: number;
              equipment: string[];
            }) => (
              <div
                key={res.id}
                css={css`
                  padding: 14px 16px;
                  border-radius: 14px;
                  background: ${colors.grey50};
                  border: 1px solid ${colors.grey200};
                `}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={getRoomName(res.roomId)}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                        res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                      }`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={
                    <Button
                      type="danger"
                      style="weak"
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('정말 취소하시겠습니까?')) {
                          cancelMutateAsync(res.id);
                        }
                      }}
                    >
                      취소
                    </Button>
                  }
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

MyReservation.Empty = function Empty() {
  return (
    <div
      css={css`
        padding: 40px 0;
        text-align: center;
        background: ${colors.grey50};
        border-radius: 14px;
      `}
    >
      <Text typography="t6" color={colors.grey500}>
        예약 내역이 없습니다.
      </Text>
    </div>
  );
};

MyReservation.TotalCounts = function TotalCounts() {
  const { data: myReservationList = [] } = useQuery({ ...getMyReservationQueryOptions });

  if (myReservationList.length === 0) {
    return null;
  }

  return (
    <Text typography="t7" fontWeight="medium" color={colors.grey500}>
      {myReservationList.length}건
    </Text>
  );
};

export default MyReservation;
