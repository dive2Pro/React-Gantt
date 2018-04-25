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
  DEFAULT_EMPTYELEMENT
} from "./components/constants";
import P from "prop-types";

import "./style/gantt.css";
import { WSATYPE_NOT_FOUND } from "constants";

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
  initialState = {
    proption: this.props.proption || 0.5,
    xLeft: this.props.startX || 200,
    dateTime: getDayMilliseconds(this.props.date),
  };
  state = this.initialState;
  constructor(props) {
    super(props)

    this._staticProps = { props: { ...props, ...this.initialState } };
    console.log(this._staticProps)
  }

  handleChange = args => {
    if (args.xLeft) {
      // return;
    }
    this.setState({
      ...Object.keys(args)
        .filter(key => {
          return this.state.hasOwnProperty(key);
        })
        .reduce((newObj, key) => {
          newObj[key] = args[key]
          if (key === 'proption' && !newObj[key]) {
            newObj[key] = 0.00002
          }
          return newObj

        }, {})
    });
  };

  render() {
    const {
      timeoutColors,
      ontimeColors,
      awaitColor,
      ...rest
    } = this.props;
    this._staticProps.props = { ...this._staticProps.props , ...this.props };
    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    const { xLeft, proption } = this.state;
    const transform = `translate( ${xLeft * -1 / proption}, 0)`;
    const { xAxisWidth, leftWidth } = rest;
    
    return (
      <GanttContext.Provider value={this.props}>
        <GanttValueStaticContext.Provider value={this._staticProps}>
          <GanttStateContext.Provider
            value={{
              ...this.state,
              transform,
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
              <Graduation {...rest} {...this.state} transform={transform} />
              <Slide {...rest} {...this.state} onStateChange={this.handleChange}>
                <svg height={rest.slideHeight} width={leftWidth + xAxisWidth}>
                  <use xlinkHref="#tasks-readOnly" x={leftWidth} y={0} />
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
