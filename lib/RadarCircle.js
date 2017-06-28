'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = RadarCircle;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d3Shape = require('d3-shape');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultCircleStyle = {
  selectedFillOpacity: 0.5,
  inactiveFillOpacity: 0.2,
  selectedStrokeOpacity: 1.0,
  inactiveStrokeOpacity: 0.7,
  pointRadius: 3,
  selectedPointFill: 'white',
  selectedPointOpacity: 1.0,
  inactivePointOpacity: 0.7
};

function RadarCircle(props) {
  var points = props.points,
      scales = props.scales,
      offsetAngles = props.offsetAngles,
      isSelected = props.isSelected,
      color = props.color,
      selectedVariableKey = props.selectedVariableKey,
      style = props.style;

  var _defaultCircleStyle$s = _extends({}, defaultCircleStyle, style),
      selectedFillOpacity = _defaultCircleStyle$s.selectedFillOpacity,
      inactiveFillOpacity = _defaultCircleStyle$s.inactiveFillOpacity,
      selectedStrokeOpacity = _defaultCircleStyle$s.selectedStrokeOpacity,
      inactiveStrokeOpacity = _defaultCircleStyle$s.inactiveStrokeOpacity,
      pointRadius = _defaultCircleStyle$s.pointRadius,
      selectedPointFill = _defaultCircleStyle$s.selectedPointFill,
      selectedPointOpacity = _defaultCircleStyle$s.selectedPointOpacity,
      inactivePointOpacity = _defaultCircleStyle$s.inactivePointOpacity;

  var lineFunction = (0, _d3Shape.radialLine)().radius(function (point) {
    return scales[point.variableKey](point.value);
  }).angle(function (point) {
    return _lodash2.default.round(offsetAngles[point.variableKey], 6);
  }).curve(_d3Shape.curveCardinalClosed);

  var pathData = lineFunction(points);
  return _react2.default.createElement(
    'g',
    null,
    _react2.default.createElement('path', {
      d: pathData,
      fill: color,
      fillOpacity: isSelected ? selectedFillOpacity : inactiveFillOpacity,
      stroke: color,
      strokeOpacity: isSelected ? selectedStrokeOpacity : inactiveStrokeOpacity
    }),
    points.map(function (point) {
      return _react2.default.createElement('circle', {
        key: point.key,
        r: pointRadius,
        fill: point.variableKey === selectedVariableKey ? selectedPointFill : color,
        stroke: color,
        cx: point.x,
        cy: point.y,
        opacity: isSelected ? selectedPointOpacity : inactivePointOpacity
      });
    })
  );
}