import { Beer } from 'business/beer/types';
import { User } from 'business/user/types';

export type ReviewType = {
  id: number;
  user: User;
  beer: Beer;
  appearance: number | null;
  smell: number | null;
  taste: number | null;
  aftertaste: number | null;
  score: number | null;
  serving: number | null;
  comment: string;
  date: string;
};
