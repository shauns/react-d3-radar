// @flow
import React from 'react';
import type {TickScale} from './types';

type RadarAxisProps = {
  scale: TickScale,
  offsetAngle: number,
  domainMax: number,
  label: string,
  color: string,
  style?: {},
};

const defaultRadarAxisStyle = {
  axisOverreach: 1.1,
  labelOverreach: 1.42,
  fontSize: 10,
  fontFamily: 'sans-serif',
  textFill: 'black',
  axisWidth: 2,
};

export default function RadarAxis(props: RadarAxisProps) {
  const {scale, offsetAngle, domainMax, label, color, style} = props;
  const {
    axisOverreach,
    labelOverreach,
    fontSize,
    fontFamily,
    textFill,
    axisWidth,
  } = {...defaultRadarAxisStyle, style};
  const xFactor = Math.cos(offsetAngle - Math.PI / 2);
  const yFactor = Math.sin(offsetAngle - Math.PI / 2);
  return (
    <g>
      <line
        x1={0}
        y1={0}
        x2={scale(domainMax * axisOverreach) * xFactor}
        y2={scale(domainMax * axisOverreach) * yFactor}
        stroke={color}
        strokeWidth={axisWidth}
      />
      <foreignObject
        x={scale(((domainMax * labelOverreach) * xFactor) - 26)}
        y={scale(((domainMax * labelOverreach) * (yFactor * 0.87)) - 7)}
        dy={'0.35em'}
        dx={'0.35em'}
      >
        <div>
          <p>{label}</p>
        </div>
      </foreignObject>
    </g>
  );
}
