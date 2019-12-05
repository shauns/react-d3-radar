// @flow
import React from 'react';
import RadarAxis from './RadarAxis';
import RadarRings from './RadarRings';
import type {RadarVariable} from './types';
import {radiusScales, forEachArray} from './utils';

type Props = {
  width: number,
  height: number,
  padding: number,
  variables: Array<RadarVariable>,
  domainMax: number,
  style?: {},
};

const defaultRadarStyle = {
  numRings: 4,
  axisColor: '#cdcdcd',
  ringColor: '#cdcdcd',
};

export default function EmptyRadar(props: Props) {
  const {width, height, padding, variables, domainMax, style} = props;
  const {axisColor, ringColor, numRings} = {...defaultRadarStyle, ...style};
  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;

  const radius = Math.min(innerWidth / 2, innerHeight / 2);
  const diameter = radius * 2;

  const scales = radiusScales(variables, domainMax, radius);

  const angleSliceRadians = Math.PI * 2 / variables.length;
  const offsetAngles = {};
  forEachArray(variables, ({key}, i) => {
    offsetAngles[key] = angleSliceRadians * i;
  });

  const backgroundScale = scales[variables[0].key];
  const ticks = backgroundScale.ticks(numRings).slice(1);
  const tickFormat = backgroundScale.tickFormat(numRings);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${padding}, ${padding})`}>
        <rect
          width={diameter}
          height={diameter}
          fill={'transparent'}
          transform={
            `translate(${(innerWidth - diameter) / 2}, ${(innerHeight -
              diameter) /
              2})`
          }
        />
        <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2})`}>
          <RadarRings
            ticks={ticks}
            scale={backgroundScale}
            color={ringColor}
            format={tickFormat}
          />
          {variables.map(({key, label}) => {
            return (
              <RadarAxis
                key={key}
                scale={scales[key]}
                offsetAngle={offsetAngles[key]}
                label={label}
                domainMax={domainMax}
                color={axisColor}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
