import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { WRAPPER_STYLES } from 'domain/common/constants';

// TODO: MessageBanner와 통합 가능
function ErrorMessageBox({ errorMessage }: { errorMessage: string | null }) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div css={WRAPPER_STYLES}>
      <Spacing size={12} />
      <div
        css={css`
          padding: 10px 14px;
          border-radius: 10px;
          background: ${colors.red50};
          display: flex;
          align-items: center;
          gap: 8px;
        `}
      >
        <Text typography="t7" fontWeight="medium" color={colors.red500}>
          {errorMessage}
        </Text>
      </div>
    </div>
  );
}

export default ErrorMessageBox;
