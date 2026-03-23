import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import MyReservation from 'domain/reservationStatus/components/MyReservation';
import { useMessage } from 'domain/reservationStatus/hooks/useMessage';
import DateSelect from 'domain/common/components/DateSelect';
import ReservationCurrentStatus from 'domain/reservationStatus/components/ReservationCurrentStatus';
import MessageBanner from 'domain/common/components/MessageBanner';
import { WRAPPER_STYLES } from 'domain/common/constants';

export function ReservationStatusPage() {
  const navigate = useNavigate();

  const [message, setMessage] = useMessage();

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div css={WRAPPER_STYLES}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <DateSelect />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <ReservationCurrentStatus />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      <MessageBanner message={message} />

      {/* 내 예약 목록 - props 개선 */}
      <MyReservation handleMessage={message => setMessage(message)} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={WRAPPER_STYLES}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
