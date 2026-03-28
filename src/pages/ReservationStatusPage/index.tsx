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

      {/* Tip #1: label이랑 UI랑 1대1 대응이 되도록 구조를 잡는다.
       * 장점: 최상단에서 한 눈에 어떤 구조인지 파악이 가능
       */}
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

      <div css={WRAPPER_STYLES}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <ReservationCurrentStatus />
        <Spacing size={16} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <MessageBanner message={message} />

      <div css={WRAPPER_STYLES}>
        <div
          css={css`
            display: flex;
            align-items: baseline;
            gap: 6px;
          `}
        >
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          <MyReservation.TotalCounts />
        </div>

        <Spacing size={16} />
        <MyReservation handleMessage={message => setMessage(message)} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={WRAPPER_STYLES}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
