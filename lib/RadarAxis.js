'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = RadarAxis;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRadarAxisStyle = {
  axisOverreach: 1.1,
  labelOverreach: 1.2,
  fontSize: 10,
  fontFamily: 'sans-serif',
  textFill: 'black',
  axisWidth: 2
};

function RadarAxis(props) {
  var scale = props.scale,
      offsetAngle = props.offsetAngle,
      domainMax = props.domainMax,
      label = props.label,
      color = props.color,
      style = props.style;

  var _defaultRadarAxisStyl = _extends({}, defaultRadarAxisStyle, { style: style }),
      axisOverreach = _defaultRadarAxisStyl.axisOverreach,
      labelOverreach = _defaultRadarAxisStyl.labelOverreach,
      fontSize = _defaultRadarAxisStyl.fontSize,
      fontFamily = _defaultRadarAxisStyl.fontFamily,
      textFill = _defaultRadarAxisStyl.textFill,
      axisWidth = _defaultRadarAxisStyl.axisWidth;

  var xFactor = Math.cos(offsetAngle - Math.PI / 2);
  var yFactor = Math.sin(offsetAngle - Math.PI / 2);
  return _react2.default.createElement(
    'g',
    null,
    _react2.default.createElement('line', {
      x1: 0,
      y1: 0,
      x2: scale(domainMax * axisOverreach) * xFactor,
      y2: scale(domainMax * axisOverreach) * yFactor,
      stroke: color,
      strokeWidth: axisWidth
    }),
    _react2.default.createElement(
      'text',
      {
        x: scale(domainMax * labelOverreach) * xFactor,
        y: scale(domainMax * labelOverreach) * yFactor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: textFill,
        textAnchor: 'middle',
        dy: '0.35em'
      },
      label
    )
  );
}