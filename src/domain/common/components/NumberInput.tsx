import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { ChangeEventHandler } from 'react';

function NumberInput({ value, onChange }: { value: number; onChange: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={e => onChange(e)}
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
  );
}

export default NumberInput;
