import React from "react";
import Slide from "./components/Slider";
import Graduation from "./components/Graduation";
import ChartSvg from "./components/ChartSvg";
import {
  moment,
  GanttStateContext,
  GanttContext,
  GanttValueStaticContext,
  Types,
  DEFAULT_EMPTYELEMENT,
  dayMillisedons,
  columns,
  NodesGId,
  HelpRectRowId
} from "./components/constants";
import P from "prop-types";

import "./style/gantt.css";
function getDayMilliseconds(date) {
  const m = moment(date).startOf("day");
  // 当天 00:00 时的 milliseconds 值
  const initialTime = m.valueOf();
  return initialTime;
}

const StringOrNumberType = P.oneOfType([P.string, P.number]);
const ColorType = P.shape({
  used: P.string,
  avarage: P.string,
  highlight: P.string
});

class StyleMap {

  constructor() {
    this.selector = new Map()
    this.onceSelector = new Map()
    const el = document.createElement('style');
    el.type = 'text/css';
    this.el = el;
    document.head.appendChild(el)
  }

  setEl(el) {
    this.el = el;
  }
  add(id, updater, once) {
    if (once) {
      //  return this.onceSelector.push() 
    }
    this.selector.set(id, updater)

  }

  update(args) {
    // 修改 
    let style = []
    this.selector.forEach((fn, key) => {
      // console.log(fn(proption))
      const returned = fn(args, key);
      const styleStr = Object.entries(returned).reduce((p, [key, value]) => {
        return p + `${key}:${value}; `
      }, ``)

      const str = `#gantt-xaxis [data-gantt-id="${key}"] {
        ${styleStr}
      }`
      style.push(str)
    })
    if (!this.el) {

      return
    }
    this.setStyle(style.join(' '))
  }

  setStyle(style) {
    window.requestAnimationFrame(() => {
      this.el.innerHTML = `
      ${style}
    `
    })

  }
}

export const sm = new StyleMap()

sm.add(HelpRectRowId, function ({ totalWidth }) {
  return {
    width: totalWidth + 'px'
  }
})
sm.add(NodesGId, function ({ transform }) {
  return {
    transform
  }
})
export default class ReactGantt extends React.PureComponent {
  static defaultProps = {
    data: [],
    renderHoverComponent: DEFAULT_EMPTYELEMENT,
    timeoutColors: {

      used: "hsl(100, 77%, 44%)",
      avarage: "hsl(103, 77%, 53%)",
      highlight: "red"
    },
    ontimeColors: {
      used: "hsl(30, 100%, 54%)",
      avarage: "hsl(39, 100%, 86%)",
      highlight: "red",
    },
    awaitColor: "hsl(103, 77%, 53%)",
    lineHeight: 50,
    leftWidth: 100,
    xAxisWidth: 1150,
    chartHeight: 200,
    minLineHeight: 2,
    slideHeight: 30
  };
  static Types = Types;
  MIN_PROPTION = 0.03;
  initialState = {
    proption: this.props.proption || 0.5,
    startX: this.props.startX == undefined ? 200 : this.props.startX,
    dateTime: getDayMilliseconds(this.props.date),
  };

  constructor(props) {
    super(props)
    this._staticProps = { props: { ...props, ...this.initialState } };
    this._staticState = {
      ...this.state,
      calcWidth: this.calcWidth,
      sm
    }
    this.state = { ...this.initialState, ...this.calculateWidthState(props.xAxisWidth / this.initialState.proption) };

  }
  calculateWidthState = (totalWidth) => {
    const helpRectWidth = totalWidth / columns;
    return {
      totalWidth,
      helpRectWidth
    }
  }

  componentDidMount() {
    sm.update(this.state)
  }

  handleChange = args => {
    const self = this
    const { xAxisWidth } = this.props
    this.setState({
      ...Object.keys(args)
        .filter(key => {
          return this.state.hasOwnProperty(key);
        })
        .reduce((newObj, key) => {
          newObj[key] = args[key]

          if (key === 'proption') {
            let value = newObj[key]
            if (!value || value <= this.MIN_PROPTION) {
              newObj[key] = value = this.MIN_PROPTION
            }
            newObj = { ...newObj, ...self.calculateWidthState(xAxisWidth / value) }

          }
          return newObj

        }, {})
    }, () => {
      const { startX, proption } = this.state
      const transform = `translate( ${startX * -1 / proption}px, 0)`;
      sm.update({ ...this.state, transform })
    });
  };
  calcWidth = (time, proption) => {
    const { xAxisWidth } = this.props
    return time /
      dayMillisedons // N
      * xAxisWidth // N
      / proption;
  }

  render() {
    const {
      timeoutColors,
      ontimeColors,
      awaitColor,
      ...rest
    } = this.props;
    this._staticProps.props = { ...this._staticProps.props, ...this.props, calcWidth: this.calcWidth, sm };
    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    const { startX, proption } = this.state;
    const transform = `translate( ${startX * -1 / proption}, 0)`;
    const { xAxisWidth, leftWidth } = rest;

    return (
      <GanttContext.Provider value={
        this.props
      }>
        <GanttValueStaticContext.Provider value={this._staticProps}>
          <GanttStateContext.Provider
            value={{
              ...this.state,
              calcWidth: this.calcWidth,
              transform,
              sm
            }}
          >
            <React.Fragment>
              <div
                className="chart-container"
                style={{
                  height: this.props.chartHeight,
                  width: xAxisWidth + leftWidth,
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                <ChartSvg {...this.props} {...this.state} transform={transform} />
              </div>
              <Graduation {...rest} {...this.state} transform={transform} helpRectWidth={this.state.helpRectWidth} />
              <Slide {...rest} {...this.state} onStateChange={this.handleChange} min={this.MIN_PROPTION}>
                <svg height={rest.slideHeight} width={leftWidth + xAxisWidth}>
                  <use xlinkHref={`#${NodesGId}readOnly`} x={leftWidth} y={0} />
                </svg>
              </Slide>
            </React.Fragment>
          </GanttStateContext.Provider>
        </GanttValueStaticContext.Provider>

      </GanttContext.Provider>
    );
  }
}

ReactGantt.propTypes = {
  data: P.arrayOf(
    P.shape({
      id: StringOrNumberType,
      name: P.string,
      usedTime: P.shape({
        startTime: StringOrNumberType,
        endTime: StringOrNumberType
      }),
      YAxis: P.string,
      highlightPoints: P.arrayOf(
        P.shape({
          time: StringOrNumberType,
          content: P.any
        })
      ),
      avarageValue: StringOrNumberType
    })
  ).isRequired,
  renderHoverComponent: P.func,
  timeoutColors: ColorType,
  ontimeColors: ColorType,
  awaitColor: P.string,
  lineHeight: StringOrNumberType,
  leftWidth: StringOrNumberType,
  chartHeight: StringOrNumberType,
  minLineHeight: StringOrNumberType,
  proption: StringOrNumberType,
  startX: StringOrNumberType
};
