import { CONFIG } from '../constants';

export const getCurrency = (value: number): string => {
  return value > 1 ? CONFIG.CURRENCY.PLURAL : CONFIG.CURRENCY.SINGLE;
};
