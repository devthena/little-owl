type ProbabilityProps = {
  [key: string]: number;
};

export const weightedRandom = (toRandomize: ProbabilityProps) => {
  let i,
    sum = 0,
    r = Math.random();
  for (i in toRandomize) {
    sum += toRandomize[i];
    if (r <= sum) return i;
  }
  return null;
};
