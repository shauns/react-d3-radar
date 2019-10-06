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
  duration: 1000,
  ease: easing.easeInOut
}).pipe(interpolate(from, to));

const Shape = posed.path(
  {
    "current": {
      "d": ({ currentPath }) => currentPath,
      transition: morphTransition,
    },
    "previous": {
      "d": ({ previousPath }) => previousPath,
      transition: morphTransition,
    },
  }
);

class RadarCircle extends React.Component<RadarCircleProps> {
  constructor(props) {
    super(props);

    this.state = {
        previousPath: this.lineFunction(this.props.previousPoints),
        currentPath: this.lineFunction(this.props.currentPoints),
        keys: ['current', 'previous'],
        index: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.setState({
        previousPath: this.lineFunction(this.props.previousPoints),
        currentPath: this.lineFunction(this.props.currentPoints),
      })
    }
  }

  componentDidMount() {
    console.log('mounted radar circle');
    setTimeout(() => {
      console.log('should have animated the fucking thing');
      this.setState({
        index: 1,
      })
    }, 5000);
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
      previousPath,
      currentPath,
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
          previousPath={previousPath}
          currentPath={currentPath}
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
