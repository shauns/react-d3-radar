// @flow
import React from "react";
import type { TickScale } from "./types";

type RadarAxisProps = {
  variableKey: string,
  scale: TickScale,
  offsetAngle: number,
  domainMax: number,
  label: string,
  color: string,
  style?: {},
  onAxisLabelClick?: ({ variableKey: string, label: string }) => void,
  onAxisLabelMouseover?: ({ variableKey: string, label: string }) => void,
  textStyle: ?{}
};

const defaultRadarAxisStyle = {
  axisOverreach: 1.1,
  labelOverreach: 1.2,
  fontSize: 10,
  fontFamily: "sans-serif",
  textFill: "black",
  axisWidth: 2
};

export default function RadarAxis(props: RadarAxisProps) {
  const {
    scale,
    offsetAngle,
    domainMax,
    label,
    color,
    style,
    onAxisLabelClick,
    onAxisLabelMouseover,
    variableKey,
    textStyle
  } = props;
  const {
    axisOverreach,
    labelOverreach,
    fontSize,
    fontFamily,
    textFill,
    axisWidth
  } = { ...defaultRadarAxisStyle, style };
  const xFactor = Math.cos(offsetAngle - Math.PI / 2);
  const yFactor = Math.sin(offsetAngle - Math.PI / 2);

  const onClick = onAxisLabelClick
    ? () => onAxisLabelClick({ variableKey, label })
    : null;

  const onMouseover = onAxisLabelMouseover
    ? () => onAxisLabelMouseover({ variableKey, label })
    : null;

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
      <text
        x={scale(domainMax * labelOverreach) * xFactor}
        y={scale(domainMax * labelOverreach) * yFactor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={textFill}
        textAnchor={"middle"}
        dy={"0.35em"}
        onClick={onClick}
        onMouseOver={onMouseover}
        style={textStyle}
      >
        {label}
      </text>
    </g>
  );
}
