import { format } from 'date-fns';

export interface Star {
  last: LastStar;
  total: TotalStar;
  getLast(): LastStar | null;
  getTotal(): TotalStar | null;
  incrementTotal(): number;
  updateLastStarDs(): string;
}

interface LastStar {
  given_ds: string;
}

interface TotalStar {
  given: number;
}

interface NewStarProps {
  last?: LastStar;
  total?: TotalStar;
}

export function newStar(newStarProps?: NewStarProps): Star {
  const last = newStarProps?.last
    ? newStarProps.last
    : {
        given_ds: format(new Date(), 'yyyy-MM-dd'),
      };

  const total = newStarProps?.total
    ? newStarProps.total
    : {
        given: 0,
      };

  const star = {
    last,
    total,
  };

  return {
    ...star,
    getLast: (): LastStar => {
      return star.last;
    },
    getTotal: (): TotalStar => {
      return star.total;
    },
    incrementTotal: (): number => {
      let currentTotal = star.total.given || 0;
      star.total.given = currentTotal += 1;
      return currentTotal;
    },
    updateLastStarDs: (): string => {
      const newDate = format(new Date(), 'yyyy-MM-dd');
      star.last.given_ds = newDate;
      return newDate;
    },
  };
}
