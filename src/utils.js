// @flow
import _ from 'lodash';
import {scaleLinear} from 'd3-scale';
import type {TickScale, RadarPoint, RadarData, RadarVariable} from './types';

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

export function radiusScales(
  variables: Array<RadarVariable>,
  domainMax: number,
  radius: number,
): {[variableKey: string]: TickScale} {
  const res = {};
  _.forEach(variables, ({key}) => {
    const scale = scaleLinear().domain([0, domainMax]).range([0, radius]);
    res[key] = scale;
  });
  return res;
}

export function radarPoints(
  data: RadarData,
  scales: {[variableKey: string]: TickScale},
  offsetAngles: {[variableKey: string]: number},
): Array<{setKey: string, points: Array<RadarPoint>}> {
  return data.sets.map(({key, values}) => {
    const points = [];
    _.forEach(values, (value, variableKey) => {
      const scale = scales[variableKey];
      const offsetAngle = offsetAngles[variableKey];
      if (scale === undefined || offsetAngle === undefined) {
        return;
      }

      const x = scale(value) * Math.cos(offsetAngle - Math.PI / 2);
      const y = scale(value) * Math.sin(offsetAngle - Math.PI / 2);

      const point = {
        x,
        y,
        value,
        setKey: key,
        variableKey,
        key: `${key}--${variableKey}`,
      };
      points.push(point);
    });

    return {setKey: key, points};
  });
}
