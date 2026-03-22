import { css } from '@emotion/react';
import { useDate } from '../hooks/useDate';
import { Spacing, Text } from '_tosslib/components';
import { formatDate } from '../utils';
import { colors } from '_tosslib/constants/colors';

function DateSelect() {
  const [date, setDate] = useDate();

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        날짜 선택
      </Text>
      <Spacing size={16} />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 6px;
        `}
      >
        <input
          type="date"
          value={date}
          min={formatDate(new Date())}
          onChange={e => setDate(e.target.value)}
          aria-label="날짜"
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
    </div>
  );
}

export default DateSelect;
