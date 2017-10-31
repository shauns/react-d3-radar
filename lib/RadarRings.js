'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = RadarRings;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRadarRingsStyle = {
  fontFamily: 'sans-serif',
  fontSize: 10,
  ringOpacity: 0.1,
  textFill: 'black'
};

function RadarRings(props) {
  var ticks = props.ticks,
      scale = props.scale,
      color = props.color,
      format = props.format,
      style = props.style;

  var _defaultRadarRingsSty = _extends({}, defaultRadarRingsStyle, style),
      fontFamily = _defaultRadarRingsSty.fontFamily,
      fontSize = _defaultRadarRingsSty.fontSize,
      ringOpacity = _defaultRadarRingsSty.ringOpacity,
      textFill = _defaultRadarRingsSty.textFill;

  var outerFirst = _lodash2.default.reverse(ticks);
  return _react2.default.createElement(
    'g',
    null,
    outerFirst.map(function (tickValue) {
      return _react2.default.createElement('circle', {
        key: '' + tickValue,
        fillOpacity: ringOpacity,
        fill: color,
        stroke: color,
        r: scale(tickValue)
      });
    }),
    outerFirst.map(function (tickValue) {
      return _react2.default.createElement(
        'text',
        {
          key: tickValue + '-tick',
          x: 0,
          y: -scale(tickValue),
          dx: '0.4em',
          dy: '0.4em',
          fontFamily: fontFamily,
          fontSize: fontSize,
          textAnchor: 'left',
          fill: textFill
        },
        format(tickValue)
      );
    })
  );
}