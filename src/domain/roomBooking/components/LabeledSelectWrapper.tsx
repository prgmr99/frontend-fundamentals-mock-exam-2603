import { Interpolation, Theme } from '@emotion/react';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ReactNode } from 'react';

type LabeledSelectWrapperProps = {
  value: string | number;
  label: string;
  title: ReactNode;
  menu: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  wrapperCss?: Interpolation<Theme>;
};

function LabeledSelectWrapper({ value, label, title, menu, onChange, wrapperCss }: LabeledSelectWrapperProps) {
  return (
    <div css={wrapperCss}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {title}
      </Text>
      <Select value={value} onChange={onChange} aria-label={label}>
        {menu}
      </Select>
    </div>
  );
}

export default LabeledSelectWrapper;
