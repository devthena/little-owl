import { v4 as uuidv4 } from 'uuid';
import { Star, newStar } from './star';

export interface UserActivity {
  user_id: string;
  star?: Star | null;
  getStar: () => Star | null;
}

export interface NewUserActivityProps {
  user_id?: string;
  star?: Star;
}

export function newUserActivity({
  user_id,
  star,
}: NewUserActivityProps): UserActivity {
  const ua = {
    user_id: user_id ? user_id : uuidv4(),
    star: star ? star : newStar(star),
  };

  return {
    ...ua,
    getStar: () => {
      return ua.star ? ua.star : null;
    },
  };
}
