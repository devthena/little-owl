import { ObjectProps } from '../constants';

export const weightedRandom = (toRandomize: ObjectProps) => {
  let i,
    sum = 0,
    r = Math.random();
  for (i in toRandomize) {
    sum += toRandomize[i];
    if (r <= sum) return i;
  }
  return null;
};
