import { CURRENCY } from '../constants';

export const getCurrency = (value: number): string => {
  return value > 1 ? CURRENCY.PLURAL : CURRENCY.SINGLE;
};
