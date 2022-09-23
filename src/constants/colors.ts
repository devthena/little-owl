import { StringObjectProps } from 'src/interfaces';

export const COLORS: StringObjectProps = {
  BLUE: '#93C7FF',
  GREEN: '#2ECC71',
  ORANGE: '#E74C3C',
  PINK: '#FFBFFA',
  PURPLE: '#9B59B6',
  RED: '#E91E63',
  YELLOW: '#F1C40F',
};

export const STATUS_COLORS: StringObjectProps = {
  BAN: COLORS.RED,
  DEFAULT: COLORS.BLUE,
  DELETE: COLORS.RED,
  JOIN: COLORS.GREEN,
  LEAVE: COLORS.YELLOW,
};
