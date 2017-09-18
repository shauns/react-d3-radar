'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatMapDeepArray = flatMapDeepArray;
exports.forEachArray = forEachArray;
exports.radiusScales = radiusScales;
exports.radarPoints = radarPoints;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d3Scale = require('d3-scale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function flatMapDeepArray(collection, fn) {
  return _lodash2.default.flatMapDeep(collection, fn);
}
function forEachArray(collection, fn) {
  _lodash2.default.forEach(collection, fn);
}

function radiusScales(variables, domainMax, radius) {
  var res = {};
  _lodash2.default.forEach(variables, function (_ref) {
    var key = _ref.key;

    var scale = (0, _d3Scale.scaleLinear)().domain([0, domainMax]).range([0, radius]);
    res[key] = scale;
  });
  return res;
}

function radarPoints(data, scales, offsetAngles) {
  var allVariableKeys = data.variables.map(function (variable) {
    return variable.key;
  });

  return data.sets.map(function (_ref2) {
    var key = _ref2.key,
        values = _ref2.values;

    var points = [];
    _lodash2.default.forEach(values, function (value, variableKey) {
      var scale = scales[variableKey];
      var offsetAngle = offsetAngles[variableKey];
      if (scale === undefined || offsetAngle === undefined) {
        return;
      }

      var x = scale(value) * Math.cos(offsetAngle - Math.PI / 2);
      var y = scale(value) * Math.sin(offsetAngle - Math.PI / 2);

      var point = {
        x: x,
        y: y,
        value: value,
        setKey: key,
        variableKey: variableKey,
        key: key + '--' + variableKey
      };
      points.push(point);
    });

    var sortedPoints = _lodash2.default.sortBy(points, function (point) {
      var pointVariableKey = point.variableKey;
      return _lodash2.default.indexOf(allVariableKeys, pointVariableKey);
    });

    return { setKey: key, points: sortedPoints };
  });
}