import React from "react";
import Slide from "./components/Slide";
import Graduation from "./components/Graduation";
import ChartSvg from "./components/ChartSvg";
import {
  moment,
  GanttStateContext,
  GanttContext,
  Types,
  DEFAULT_EMPTYELEMENT
} from "./components/constants";
import P from 'prop-types'

import "./style/gantt.css";
import { WSATYPE_NOT_FOUND } from "constants";

function getDayMilliseconds(date) {
  const m = moment(date).startOf("day");
  // 当天 00:00 时的 milliseconds 值
  const initialTime = m.valueOf();
  return initialTime;
}

const StringOrNumberType = P.oneOfType([
  P.string,
  P.number
])
const ColorType =  P.shape({
  used: P.string,
  avarage: P.string,
  highlight: P.string
})

export default class ReactGantt extends React.PureComponent {
  
  static defaultProps = {
    data: [],
    renderHoverComponent: DEFAULT_EMPTYELEMENT,
    timeoutColors: {
      used: "hsl(30, 100%, 54%)",
      avarage: "hsl(39, 100%, 86%)",
      highlight: "red"
    },
    ontimeColors: {
      used: "hsl(100, 77%, 44%)",
      avarage: "hsl(103, 77%, 53%)",
      highlight: "red"
    },
    awaitColor: "hsl(103, 77%, 53%)",
    lineHeight: 50,
    yAxisWidth: 100,
    xAxisWidth: 1150,
    xAxisHeight: 200,
    minLineHeight: 2
  };
  static Types = Types;
  initialState = {
    proption: this.props.proption || 0.5,
    xLeft:  this.props.startX || 200,
    dateTime: getDayMilliseconds(this.props.date),
    slideHeight: 30
  };
  state = this.initialState;

  handleChange = args => {
    this.setState({
      ...Object.keys(args)
        .filter(key => {
          return this.state.hasOwnProperty(key);
        })
        .reduce((newObj, key) => ((newObj[key] = args[key]), newObj), {})
    });
  };

  render() {
    const {
      xAxisHeight,
      timeoutColors,
      ontimeColors,
      awaitColor,
      renderHoverComponent,
      ...rest
    } = this.props;

    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    const { xLeft, proption, slideHeight } = this.state;
    const transform = `translate( ${xLeft * -1 / proption}, 0)`;
    const { xAxisWidth, yAxisWidth } = rest;
    return (
      <GanttContext.Provider value={{ ...this.props }}>
        <GanttStateContext.Provider
          value={{
            ...this.state,
            transform,
            ontimeColors,
            timeoutColors,
            awaitColor
          }}
        >
          <div>
            <div
              className="chart-container"
              style={{
                height: xAxisHeight,
                width: xAxisWidth + yAxisWidth,
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              <ChartSvg {...this.props} {...this.state} transform={transform} />
            </div>
            <Graduation {...rest} {...this.state} transform={transform} />
            <Slide {...rest} {...this.state} onStateChange={this.handleChange}>
              <svg height={slideHeight} width={yAxisWidth + xAxisWidth}>
                <use xlinkHref="#tasks-readOnly" x={yAxisWidth} y={0} />
              </svg>
            </Slide>
          </div>
        </GanttStateContext.Provider>
      </GanttContext.Provider>
    );
  }
}

ReactGantt.propTypes = {
  data: P.arrayOf(P.shape({
    id: P.string,
    name: P.string,
    usedTime: P.shape({
      startTime:StringOrNumberType,
      endTime: StringOrNumberType})
    ,
    YAxis:P.string,
    highlightPoints: P.arrayOf(P.shape({
      time: StringOrNumberType,
      content: P.any
    })),
    avarageValue: StringOrNumberType
  })).isRequired,
  renderHoverComponent: P.func,
  timeoutColors:ColorType,
  ontimeColors:ColorType,
  awaitColor: P.string,
  lineHeight: StringOrNumberType,
  yAxisWidth: StringOrNumberType,
  xAxisHeight: StringOrNumberType,
  minLineHeight: StringOrNumberType,
  proption: StringOrNumberType.isRequired,
  startX: StringOrNumberType.isRequired
}