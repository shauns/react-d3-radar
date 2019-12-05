'use strict';

//import $ from 'jquery';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RadarAxis = require('./RadarAxis');

var _RadarAxis2 = _interopRequireDefault(_RadarAxis);

var _RadarCircle = require('./RadarCircle');

var _RadarCircle2 = _interopRequireDefault(_RadarCircle);

var _RadarRings = require('./RadarRings');

var _RadarRings2 = _interopRequireDefault(_RadarRings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultRadarStyle = {
  numRings: 4,
  axisColor: '#cdcdcd',
  ringColor: '#cdcdcd'
};

function getOffsets(e, chart) {
  var offsetDict = {}
  var rect = chart.getBoundingClientRect();
  offsetDict['x'] = e.clientX - rect.left;
  offsetDict['y'] = e.clientY - rect.top;
  return offsetDict;
}

function getHovered(chart, event, height, width, padding, radius, voronoiDiagram) {
  var innerHeight = height - padding * 2;
  var innerWidth = width - padding * 2;
  var diameter = radius * 2;

  var offsets = getOffsets(event, chart)

  var clientX = offsets['x'],
      clientY = offsets['y'];

  clientX -= padding;
  clientY -= padding;
  
  clientX -= (innerWidth - diameter) / 2;
  clientY -= (innerHeight - diameter) / 2;

  var site = voronoiDiagram.find(clientX, clientY, radius / 2);
  if (!site) {
    return null;
  }

  var data = site.data;

  return data;
}

var RadarWrapper = function (_Component) {
  _inherits(RadarWrapper, _Component);

  function RadarWrapper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RadarWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RadarWrapper.__proto__ || Object.getPrototypeOf(RadarWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.hoverMap = null, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RadarWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;
      if (this.hoverMap) {
        this.hoverMap.addEventListener('mousemove', function (event) {
          var onHover = _this2.props.onHover;

          if (!onHover) {
            return;
          }
          var _props = _this2.props,
              padding = _props.padding,
              height = _props.height,
              width = _props.width,
              radius = _props.radius,
              voronoiDiagram = _props.voronoiDiagram;

          onHover(getHovered(this, event, height, width, padding, radius, voronoiDiagram));
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          padding = _props2.padding,
          radius = _props2.radius,
          style = _props2.style,
          highlighted = _props2.highlighted,
          scales = _props2.scales,
          variables = _props2.variables,
          offsetAngles = _props2.offsetAngles,
          domainMax = _props2.domainMax,
          highlightedPoint = _props2.highlightedPoint,
          regularPoints = _props2.regularPoints,
          backgroundScale = _props2.backgroundScale,
          colors = _props2.colors;

      var diameter = radius * 2;

      var _defaultRadarStyle$st = _extends({}, defaultRadarStyle, style),
          axisColor = _defaultRadarStyle$st.axisColor,
          ringColor = _defaultRadarStyle$st.ringColor,
          numRings = _defaultRadarStyle$st.numRings;

      var innerHeight = height - padding * 2;
      var innerWidth = width - padding * 2;

      var ticks = backgroundScale.ticks(numRings).slice(1);
      var tickFormat = backgroundScale.tickFormat(numRings);

      return _react2.default.createElement(
        'svg',
        { width: width, height: height },
        _react2.default.createElement(
          'g',
          {
            transform: 'translate(' + padding + ', ' + padding + ')',
            ref: function ref(c) {
              _this3.hoverMap = c;
            }
          },
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
            }),
            regularPoints.map(function (_ref3) {
              var setKey = _ref3.setKey,
                  points = _ref3.points;

              return _react2.default.createElement(_RadarCircle2.default, {
                key: setKey,
                points: points,
                scales: scales,
                offsetAngles: offsetAngles,
                color: colors[setKey],
                isSelected: false,
                selectedVariableKey: null
              });
            }),
            highlightedPoint ? _react2.default.createElement(_RadarCircle2.default, {
              key: highlightedPoint.setKey,
              points: highlightedPoint.points,
              scales: scales,
              offsetAngles: offsetAngles,
              color: colors[highlightedPoint.setKey],
              isSelected: true,
              selectedVariableKey: highlighted ? highlighted.variableKey : null
            }) : null
          )
        )
      );
    }
  }]);

  return RadarWrapper;
}(_react.Component);

exports.default = RadarWrapper;