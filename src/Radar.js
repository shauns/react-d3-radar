// @flow
import React from 'react';
import {scaleLinear, schemeCategory10} from 'd3-scale';
import {voronoi} from 'd3-voronoi';
import _ from 'lodash';
import {flatMapDeepArray, forEachArray} from './utils';
import type {TickScale, RadarPoint, RadarData} from './types';
import RadarWrapper from './RadarWrapper';

function radiusScales(
  data: RadarData,
  domainMax: number,
  radius: number,
): {[variableKey: string]: TickScale} {
  const res = {};
  _.forEach(data.variables, ({key}) => {
    const scale = scaleLinear().domain([0, domainMax]).range([0, radius]);
    res[key] = scale;
  });
  return res;
}

function radarPoints(
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

type Props = {
  data: RadarData,
  width: number,
  height: number,
  padding: number,
  domainMax: number,
  style?: {},
  onHover?: (point: RadarPoint | null) => void,
  highlighted: ?RadarPoint,
};

function convertData(props) {
  const {data, width, height, padding, domainMax} = props;
  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;

  const radius = Math.min(innerWidth / 2, innerHeight / 2);
  const scales = radiusScales(data, domainMax, radius);

  const angleSliceRadians = Math.PI * 2 / data.variables.length;
  const offsetAngles = {};
  forEachArray(data.variables, ({key}, i) => {
    offsetAngles[key] = angleSliceRadians * i;
  });

  const allPoints = radarPoints(data, scales, offsetAngles);
  const flatPointList = flatMapDeepArray(allPoints, ({points}) => {
    return points;
  });

  const voronoiDiagram = voronoi()
    .x((d: RadarPoint) => d.x + radius)
    .y((d: RadarPoint) => d.y + radius)
    .size([radius * 2, radius * 2])(flatPointList);

  return {allPoints, scales, offsetAngles, voronoiDiagram, radius};
}

export default function Radar(props: Props) {
  const {
    data,
    width,
    height,
    padding,
    domainMax,
    style,
    onHover,
    highlighted,
  } = props;
  const {allPoints, scales, offsetAngles, radius, voronoiDiagram} = convertData(
    props,
  );

  const highlightedSetKey = highlighted ? highlighted.setKey : null;

  const backgroundScale = scales[data.variables[0].key];

  const colors = {};
  forEachArray(allPoints, ({setKey}, idx) => {
    colors[setKey] = schemeCategory10[idx];
  });

  const [highlightedPoints, regularPoints] = _.partition(
    allPoints,
    ({setKey}) => setKey === highlightedSetKey,
  );

  return (
    <RadarWrapper
      variables={data.variables}
      width={width}
      height={height}
      padding={padding}
      domainMax={domainMax}
      style={style}
      onHover={onHover}
      highlighted={highlighted}
      scales={scales}
      backgroundScale={backgroundScale}
      offsetAngles={offsetAngles}
      voronoiDiagram={voronoiDiagram}
      radius={radius}
      highlightedPoint={
        highlightedPoints.length > 0 ? highlightedPoints[0] : null
      }
      regularPoints={regularPoints}
      colors={colors}
    />
  );
}
