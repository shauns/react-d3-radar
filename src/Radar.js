// @flow
import React, {Component} from 'react';
import {scaleLinear, schemeCategory10} from 'd3-scale';
import {voronoi} from 'd3-voronoi';
import _ from 'lodash';
import {flatMapDeepArray, forEachArray} from './utils';
import type {TickScale, RadarPoint, RadarData} from './types';
import RadarAxis from './RadarAxis';
import RadarCircle from './RadarCircle';
import RadarRings from './RadarRings';

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
};

const defaultRadarStyle = {
  numRings: 4,
  axisColor: '#cdcdcd',
  ringColor: '#cdcdcd',
};

type State = {
  selected: ?RadarPoint,
  scales: {[variableKey: string]: TickScale},
  offsetAngles: {[variableKey: string]: number},
  allPoints: Array<{setKey: string, points: Array<RadarPoint>}>,
  voronoiDiagram: any,
  radius: number,
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

export default class Radar extends Component {
  props: Props;

  state: State;

  hoverMap = null;

  constructor(props: Props) {
    super(props);
    this.state = {selected: null, ...convertData(props)};
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({selected: null, ...convertData(nextProps)});
  }

  componentDidMount() {
    if (this.hoverMap) {
      this.hoverMap.addEventListener('mousemove', (event: MouseEvent) => {
        const {padding} = this.props;
        let {offsetX: clientX, offsetY: clientY} = event;
        clientX -= padding;
        clientY -= padding;
        const {voronoiDiagram, radius} = this.state;
        const site = voronoiDiagram.find(clientX, clientY, radius / 2);
        if (!site) {
          this.setState({selected: null});
          return;
        }

        const {data} = site;
        const {selected: currentSelected} = this.state;
        if (!currentSelected || currentSelected.key !== data.key) {
          this.setState({selected: data});
        }
      });
    }
  }

  render() {
    const {data, width, height, padding, domainMax, style} = this.props;
    const {allPoints, scales, offsetAngles, selected} = this.state;
    const {axisColor, ringColor, numRings} = {...defaultRadarStyle, ...style};

    const selectedSetKey = selected ? selected.setKey : null;

    const innerHeight = height - padding * 2;
    const innerWidth = width - padding * 2;

    const backgroundScale = scales[data.variables[0].key];
    const ticks = backgroundScale.ticks(numRings).slice(1);
    const tickFormat = backgroundScale.tickFormat(numRings);

    const colors = {};
    forEachArray(allPoints, ({setKey}, idx) => {
      colors[setKey] = schemeCategory10[idx];
    });

    const [selectedPoints, unSelectedPoints] = _.partition(
      allPoints,
      ({setKey}) => setKey === selectedSetKey,
    );

    return (
      <svg width={width} height={height}>
        <g
          transform={`translate(${padding}, ${padding})`}
          ref={c => {
            this.hoverMap = c;
          }}
        >
          <rect width={innerWidth} height={innerHeight} fill={'transparent'} />
          <g transform={`translate(${innerWidth / 2}, ${innerHeight / 2})`}>
            <RadarRings
              ticks={ticks}
              scale={backgroundScale}
              color={ringColor}
              format={tickFormat}
            />
            {data.variables.map(({key, label}) => {
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
            {unSelectedPoints.map(({setKey, points}) => {
              const isSelected = setKey === selectedSetKey;
              const selectedVariableKey = isSelected && selected
                ? selected.variableKey
                : null;
              return (
                <RadarCircle
                  key={setKey}
                  points={points}
                  scales={scales}
                  offsetAngles={offsetAngles}
                  color={colors[setKey]}
                  isSelected={isSelected}
                  selectedVariableKey={selectedVariableKey}
                />
              );
            })}
            {selectedPoints.map(({setKey, points}) => {
              const isSelected = setKey === selectedSetKey;
              const selectedVariableKey = isSelected && selected
                ? selected.variableKey
                : null;
              return (
                <RadarCircle
                  key={setKey}
                  points={points}
                  scales={scales}
                  offsetAngles={offsetAngles}
                  color={colors[setKey]}
                  isSelected={isSelected}
                  selectedVariableKey={selectedVariableKey}
                />
              );
            })}
          </g>
        </g>
      </svg>
    );
  }
}
