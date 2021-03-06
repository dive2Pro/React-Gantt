import React from "react";
import Slide from "./components/Slider";
import Graduation from "./components/Graduation";
import {
  moment,
  GanttStateContext,
  GanttValueStaticContext,
  Types,
  DEFAULT_EMPTYELEMENT,
  dayMillisedons,
  columns,
  NodesGId
} from "./components/constants";
import P from "prop-types";
import { styleUpdateMap } from './StyleMap'
import "./style/gantt.css";
import VirtualizeList from './components/VirtualizeList'
import Task from './components/ChartSvg/Nodes/Tasks'
import HelpRects from './components/ChartSvg/HelpRects'



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


export default class ReactGantt extends React.Component {
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
    styleUpdateMap
  };

  constructor(props) {
    super(props)
    this._staticProps = this.getStaticProps(props)
    this._staticState = {
      ...this.state,
      calcWidth: this.calcWidth,
      styleUpdateMap
    }
    this.state = { ...this.initialState, ...this.calculateWidthState(props.xAxisWidth / this.initialState.proption) };
    styleUpdateMap.setArgs(this.getStyleUpdateMapArgs())
  }

  getStaticProps = (props) => {
    return {
      ...props,
      ...this.initialState,
      calcWidth: this.calcWidth,
      styleUpdateMap
    }
  }
  calculateWidthState = (totalWidth) => {
    const helpRectWidth = totalWidth / columns;
    return {
      totalWidth,
      helpRectWidth
    }
  }
  componentWillReceiveProps(nextProps) {
    this._staticProps = this.getStaticProps(nextProps)
    
  }
  componentDidMount() {
    this.updateStyleMap()
  }

  getStyleUpdateMapArgs = () => {

    const { xAxisWidth } = this.props
    const { startX, proption } = this.state
    const transform = `translate( ${startX * -1 / proption}px, 0)`;
    return { ...this.state, transform, dayMillisedons, xAxisWidth }
  }
  updateStyleMap = () => {
    styleUpdateMap.update(this.getStyleUpdateMapArgs())
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
    }, this.updateStyleMap);
  };

  calcWidth = (time, proption = this.state.proption) => {
    const { xAxisWidth } = this.props
    return time /
      dayMillisedons
      * xAxisWidth
      / proption;
  }

  renderItem = (i, { offset, size }) => {
    const { lineHeight, fontSize = 12, renderHoverComponent,
      xAxisWidth,
      data, leftWidth,
    } = this.props
    const dataItem = data[i]
    const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
    return <Task {...this.props} dataItem={dataItem}
      y={offset}
      key={i}
      lineHeight={size}
      width={xAxisWidth}
      fontSize={12} awaitStartTime={awaitStartTime} />
  }

  renderWrapper = ({ items, handleScroll, totalHeight, offset }) => {
    const { lineHeight, data, xAxisWidth, leftWidth, chartHeight, slideHeight } = this.props
    const readOnly = false
    const { proption } = this.state
    return <div
      className="chart-container"
      style={{
        height: chartHeight,
        width: xAxisWidth + leftWidth,
        overflowY: "auto",
        overflowX: "hidden",
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div
        style={{ height: lineHeight * data.length, width: '100%' }}>
        <svg
          style={{ width: '100%', height: '100%' }}>
          <g
            id={`${NodesGId}${readOnly ? String("readOnly") : ""}`}
          >
            <defs>
              <g id="_def">
                {
                  React.Children.map(items, (item, i) => React.cloneElement(item, {
                    readOnly: true, i, count: items.length,
                    totalHeight: slideHeight
                  }))
                }
              </g>
            </defs>
            <HelpRects height={chartHeight}
              offset={offset}
              leftWidth={leftWidth}
              width={xAxisWidth} />
            <g>
              {items}
            </g>
          </g>
        </svg>
      </div>
    </div>
  }
  getProps = () => {
    if (this.changed) {
      this.changed = false
      return { ...this.props, data: this.props.data.slice(this.dataSliceStart, this.dataSliceEnd), sliceStart: this.dataSliceStart }
    }
    return this.props
  }
  
  render() {
    const {
      slideHeight,
      ...rest
    } = this.props;
    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    const { startX, proption } = this.state;
    const { xAxisWidth, leftWidth, data, lineHeight } = rest;
    return (
      <GanttValueStaticContext.Provider value={this._staticProps}>
        <GanttStateContext.Provider
          value={this.state}
        >
          <VirtualizeList
            itemCount={data.length}
            renderItem={
              this.renderItem
            }
            ItemSize={50}
            containerSize={this.props.chartHeight}
            renderWrapper={this.renderWrapper}
          />
          <Graduation {...rest} {...this.state} helpRectWidth={this.state.helpRectWidth} h={50} />
          <Slide onStateChange={this.handleChange}
            dragStateChange={this.dragStateChange}
            min={this.MIN_PROPTION}
            width={xAxisWidth}
            proption={proption}
            leftWidth={leftWidth}
            startX={startX}
            h={slideHeight}
          >
            <svg height={rest.slideHeight} width={leftWidth + xAxisWidth}>
              <use xlinkHref={`#_def`} x={leftWidth} y={0} />
            </svg>
          </Slide>
        </GanttStateContext.Provider>
      </GanttValueStaticContext.Provider>
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
  startX: StringOrNumberType,
  slideHeight: StringOrNumberType
};
