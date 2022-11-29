import { Brewery } from 'business/brewery/types';
import { Style } from 'business/styles/types';

export interface Color {
  id: number;
  name: string;
  color: string;
}

export type Beer = {
  id: number;
  name: string;
  brewery: Brewery;
  style: Style;
  abv: number;
  ibu: number | null;
  color: Color | null;
};
