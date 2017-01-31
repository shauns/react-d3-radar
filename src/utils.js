// @flow
import _ from 'lodash';

export function flatMapDeepArray<T, R>(
  collection: Array<T>,
  fn: (d: T) => Array<R>,
): Array<R> {
  return _.flatMapDeep(collection, fn);
}
export function forEachArray<T>(
  collection: Array<T>,
  fn: (item: T, idx: number) => void,
): void {
  _.forEach(collection, fn);
}
