// @flow
import flatMapDeep from "lodash/flatMapDeep";
import forEach from "lodash/forEach";
import sortBy from "lodash/sortBy";
import indexOf from "lodash/indexOf";
import { scaleLinear } from "d3-scale";
import type { TickScale, RadarPoint, RadarData, RadarVariable } from "./types";

export function flatMapDeepArray<T, R>(
  collection: Array<T>,
  fn: (d: T) => Array<R>
): Array<R> {
  return flatMapDeep(collection, fn);
}
export function forEachArray<T>(
  collection: Array<T>,
  fn: (item: T, idx: number) => void
): void {
  forEach(collection, fn);
}

export function radiusScales(
  variables: Array<RadarVariable>,
  domainMax: number,
  radius: number
): { [variableKey: string]: TickScale } {
  const res = {};
  forEach(variables, ({ key }) => {
    const scale = scaleLinear()
      .domain([0, domainMax])
      .range([0, radius]);
    res[key] = scale;
  });
  return res;
}

export function radarPoints(
  data: RadarData,
  scales: { [variableKey: string]: TickScale },
  offsetAngles: { [variableKey: string]: number }
): Array<{ setKey: string, points: Array<RadarPoint>, color?: string }> {
  const allVariableKeys = data.variables.map(variable => variable.key);

  return data.sets.map(({ key, values, ...rest }) => {
    const points = [];
    forEach(values, (value, variableKey) => {
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
        key: `${key}--${variableKey}`
      };
      points.push(point);
    });

    const sortedPoints = sortBy(points, point => {
      const pointVariableKey = point.variableKey;
      return indexOf(allVariableKeys, pointVariableKey);
    });

    return { setKey: key, points: sortedPoints, ...rest };
  });
}
