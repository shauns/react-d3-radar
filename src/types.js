// @flow
export type TickScale = {
  (d: number): number,
  ticks(count: number): Array<number>,
  tickFormat(count: number, fmt: ?string): (val: number) => string,
};

export type RadarVariable = {key: string, label: string};

type RadarDataSet = {
  key: string,
  label: string,
  values: {[variableKey: string]: number},
};

export type RadarData = {
  variables: Array<RadarVariable>,
  sets: Array<RadarDataSet>,
};

export type RadarPoint = {
  x: number,
  y: number,
  value: number,
  setKey: string,
  variableKey: string,
  key: string,
};
