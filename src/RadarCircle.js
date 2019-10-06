// @flow
import React, {useEffect} from 'react';
import _ from 'lodash';
import {styler, tween, easing} from 'popmotion';
import posed from 'react-pose';
import {interpolate} from 'flubber';
import {radialLine, curveCardinalClosed} from 'd3-shape';
import type {TickScale, RadarPoint} from './types';

type RadarCircleProps = {
  currentPoints: Array<RadarPoint>,
  previousPoints: Array<RadarPoint>,
  scales: {[variableKey: string]: TickScale},
  offsetAngles: {[variableKey: string]: number},
  isSelected: boolean,
  selectedVariableKey: ?string,
  color: string,
  style?: {},
};

const defaultCircleStyle = {
  selectedFillOpacity: 0.5,
  inactiveFillOpacity: 0.2,
  selectedStrokeOpacity: 1.0,
  inactiveStrokeOpacity: 0.7,
  pointRadius: 3,
  selectedPointFill: 'white',
  selectedPointOpacity: 1.0,
  inactivePointOpacity: 0.7,
};

const morphTransition = ({ from, to }) => tween({
  from: 0,
  to: 1,
  duration: 1000, // todo: make this prop
  ease: easing.easeInOut
}).pipe(interpolate(from, to));

const Shape = posed.path(
  {
    "a": {
      "d": ({ aPath }) => aPath,
      transition: morphTransition,
    },
    "b": {
      "d": ({ bPath }) => bPath,
      transition: morphTransition,
    },
  }
);

class RadarCircle extends React.Component<RadarCircleProps> {
  constructor(props) {
    super(props);

    this.state = {
        aPath: this.lineFunction(this.props.previousPoints),
        bPath: this.lineFunction(this.props.currentPoints),
        keys: ['a', 'b'],
        index: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPoints != this.props.currentPoints) {
      this.alternatePaths();
    }
  }

  alternatePaths = () => {
    const { index, keys } = this.state;

    if (keys[index] === 'a') {
      // load the new svg into b and switcht to b
      this.setState({
        bPath:  this.lineFunction(this.props.currentPoints),
        index: index === 0 ? 1 : 0,
      })
    }

    if (keys[index] === 'b') {
      // load the new svg into b and switcht to b
      this.setState({
        aPath:  this.lineFunction(this.props.currentPoints),
        index: index === 0 ? 1 : 0,
      })
    }

    return;
  }

  lineFunction = radialLine()
    .radius((point: RadarPoint) => this.props.scales[point.variableKey](point.value))
    .angle((point: RadarPoint) => _.round(this.props.offsetAngles[point.variableKey], 6))
    .curve(curveCardinalClosed);

  render() {
    const {
      isSelected,
      color,
      style,
    } = this.props;

    const {
      index,
      keys,
      aPath,
      bPath,
    } = this.state;

    const {
      selectedFillOpacity,
      inactiveFillOpacity,
      selectedStrokeOpacity,
      inactiveStrokeOpacity,
    } = {...defaultCircleStyle, ...style};

    return (
      <g>
        <Shape
          pose={keys[index]}
          aPath={aPath}
          bPath={bPath}
          fill={color}
          fillOpacity={isSelected ? selectedFillOpacity : inactiveFillOpacity}
          stroke={color}
          strokeOpacity={
            isSelected ? selectedStrokeOpacity : inactiveStrokeOpacity
          }
        />
      </g>
    );
  };
}

export default RadarCircle;
