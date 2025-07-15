import { ascend, prop, sort } from 'ramda';

export interface ISortable {
  position: number;
}

export function sortItems<T extends ISortable>(list: T[]): T[] {
  return sort(ascend(prop('position')), list);
}
