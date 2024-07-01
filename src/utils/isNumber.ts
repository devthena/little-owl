export const isNumber = (value: string): boolean => {
  const regex = /^-?\d+$/;
  return regex.test(value);
};
