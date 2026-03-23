import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { WRAPPER_STYLES } from 'domain/common/constants';

type MessageBannerProps = {
  message: string | { type: 'success' | 'error'; text: string } | null;
};

function MessageBanner({ message }: MessageBannerProps) {
  if (!message) return null;

  const isString = typeof message === 'string';

  const text = isString ? message : message.text;

  const type = isString ? 'success' : message.type;

  return (
    <div css={WRAPPER_STYLES}>
      <div
        css={css`
          padding: 10px 14px;
          border-radius: 10px;
          background: ${type === 'success' ? colors.blue50 : colors.red50};
          display: flex;
          align-items: center;
          gap: 8px;
        `}
      >
        <Text typography="t7" fontWeight="medium" color={type === 'success' ? colors.blue600 : colors.red500}>
          {text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}

export default MessageBanner;
