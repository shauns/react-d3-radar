'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = EmptyRadar;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RadarAxis = require('./RadarAxis');

var _RadarAxis2 = _interopRequireDefault(_RadarAxis);

var _RadarRings = require('./RadarRings');

var _RadarRings2 = _interopRequireDefault(_RadarRings);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRadarStyle = {
  numRings: 4,
  axisColor: '#cdcdcd',
  ringColor: '#cdcdcd'
};

function EmptyRadar(props) {
  var width = props.width,
      height = props.height,
      padding = props.padding,
      variables = props.variables,
      domainMax = props.domainMax,
      style = props.style;

  var _defaultRadarStyle$st = _extends({}, defaultRadarStyle, style),
      axisColor = _defaultRadarStyle$st.axisColor,
      ringColor = _defaultRadarStyle$st.ringColor,
      numRings = _defaultRadarStyle$st.numRings;

  var innerHeight = height - padding * 2;
  var innerWidth = width - padding * 2;

  var radius = Math.min(innerWidth / 2, innerHeight / 2);
  var diameter = radius * 2;

  var scales = (0, _utils.radiusScales)(variables, domainMax, radius);

  var angleSliceRadians = Math.PI * 2 / variables.length;
  var offsetAngles = {};
  (0, _utils.forEachArray)(variables, function (_ref, i) {
    var key = _ref.key;

    offsetAngles[key] = angleSliceRadians * i;
  });

  var backgroundScale = scales[variables[0].key];
  var ticks = backgroundScale.ticks(numRings).slice(1);
  var tickFormat = backgroundScale.tickFormat(numRings);

  return _react2.default.createElement(
    'svg',
    { width: width, height: height },
    _react2.default.createElement(
      'g',
      { transform: 'translate(' + padding + ', ' + padding + ')' },
      _react2.default.createElement('rect', {
        width: diameter,
        height: diameter,
        fill: 'transparent',
        transform: 'translate(' + (innerWidth - diameter) / 2 + ', ' + (innerHeight - diameter) / 2 + ')'
      }),
      _react2.default.createElement(
        'g',
        { transform: 'translate(' + innerWidth / 2 + ', ' + innerHeight / 2 + ')' },
        _react2.default.createElement(_RadarRings2.default, {
          ticks: ticks,
          scale: backgroundScale,
          color: ringColor,
          format: tickFormat
        }),
        variables.map(function (_ref2) {
          var key = _ref2.key,
              label = _ref2.label;

          return _react2.default.createElement(_RadarAxis2.default, {
            key: key,
            scale: scales[key],
            offsetAngle: offsetAngles[key],
            label: label,
            domainMax: domainMax,
            color: axisColor
          });
        })
      )
    )
  );
}