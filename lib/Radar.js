'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = Radar;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d3Voronoi = require('d3-voronoi');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _RadarWrapper = require('./RadarWrapper');

var _RadarWrapper2 = _interopRequireDefault(_RadarWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertData(props) {
  var data = props.data,
      width = props.width,
      height = props.height,
      padding = props.padding,
      domainMax = props.domainMax;

  var innerHeight = height - padding * 2;
  var innerWidth = width - padding * 2;

  var radius = Math.min(innerWidth / 2, innerHeight / 2);
  var scales = (0, _utils.radiusScales)(data.variables, domainMax, radius);

  var angleSliceRadians = Math.PI * 2 / data.variables.length;
  var offsetAngles = {};
  (0, _utils.forEachArray)(data.variables, function (_ref, i) {
    var key = _ref.key;

    offsetAngles[key] = angleSliceRadians * i;
  });

  var allPoints = (0, _utils.radarPoints)(data, scales, offsetAngles);
  var flatPointList = (0, _utils.flatMapDeepArray)(allPoints, function (_ref2) {
    var points = _ref2.points;

    return points;
  });

  var voronoiDiagram = (0, _d3Voronoi.voronoi)().x(function (d) {
    return d.x + radius;
  }).y(function (d) {
    return d.y + radius;
  }).size([radius * 2, radius * 2])(flatPointList);

  return { allPoints: allPoints, scales: scales, offsetAngles: offsetAngles, voronoiDiagram: voronoiDiagram, radius: radius };
}

function Radar(props) {
  var data = props.data,
      width = props.width,
      height = props.height,
      padding = props.padding,
      domainMax = props.domainMax,
      style = props.style,
      onHover = props.onHover,
      highlighted = props.highlighted;

  var _convertData = convertData(props),
      allPoints = _convertData.allPoints,
      scales = _convertData.scales,
      offsetAngles = _convertData.offsetAngles,
      radius = _convertData.radius,
      voronoiDiagram = _convertData.voronoiDiagram;

  var highlightedSetKey = highlighted ? highlighted.setKey : null;

  var backgroundScale = scales[data.variables[0].key];

  var colors = {};
  (0, _utils.forEachArray)(allPoints, function (_ref3, idx) {
    var setKey = _ref3.setKey;

    colors[setKey] = _d3Scale.schemeCategory10[idx];
  });

  var _$partition = _lodash2.default.partition(allPoints, function (_ref4) {
    var setKey = _ref4.setKey;
    return setKey === highlightedSetKey;
  }),
      _$partition2 = _slicedToArray(_$partition, 2),
      highlightedPoints = _$partition2[0],
      regularPoints = _$partition2[1];

  return _react2.default.createElement(_RadarWrapper2.default, {
    variables: data.variables,
    width: width,
    height: height,
    padding: padding,
    domainMax: domainMax,
    style: style,
    onHover: onHover,
    highlighted: highlighted,
    scales: scales,
    backgroundScale: backgroundScale,
    offsetAngles: offsetAngles,
    voronoiDiagram: voronoiDiagram,
    radius: radius,
    highlightedPoint: highlightedPoints.length > 0 ? highlightedPoints[0] : null,
    regularPoints: regularPoints,
    colors: colors
  });
}