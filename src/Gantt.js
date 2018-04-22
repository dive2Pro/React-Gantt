import React from "react";
import moment from "moment";
import { DragDropContextProvider, DragSource } from "react-dnd";
import createHTML5Backend from "react-dnd-html5-backend";
import throttle from "lodash/throttle";

import "./gantt.css";

const GanttContext = React.createContext({});
const GanttStateContext = React.createContext({});

function callAll(...fns) {
  return function eventHandle(...args) {
    fns.filter(Boolean).forEach(fn => {
      fn.apply(this, args);
    });
  };
}

const YAxis = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, yAxisWidth }) => {
        console.log(" YA");

        const startX = 0,
          startY = 0;
        return data.map(({ YAxis: name }, i) => {
          return (
            <React.Fragment key={name}>
              <g>
                <rect
                  fill={"white"}
                  x={startX}
                  y={startY + h * i}
                  width={yAxisWidth}
                  height={h}
                />
                <text
                  x={yAxisWidth / 2 - 50 / 2}
                  y={startY + h / 2 + 23 / 4 + h * i}
                >
                  {name}
                </text>
              </g>
            </React.Fragment>
          );
        });
      }}
    </GanttContext.Consumer>
  );
};
const columns = 48;

class HelpRect extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { r, c, h, originalWidth } = this.props;
    return (
      <GanttStateContext.Consumer>
        {({ xLeft, proption }) => {
          const transform = `translate( ${xLeft * -1}, 0)`;
          let y = h * r;
          const width = originalWidth / proption;
          let x = width * c;

          return (
            <rect
              transform={transform}
              stroke="blue"
              strokeWidth={0.2}
              strokeOpacity={0.5}
              strokeDasharray={[5, 3]}
              strokeDashoffset={2}
              fill={"#fff"}
              x={x}
              y={y}
              width={width}
              height={h}
            />
          );
        }}
      </GanttStateContext.Consumer>
    );
  }
}

class HelpRects extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { lineHeight: h, data, xAxisWidth } = this.props;
    const rows = data.length;
    let rects = [];
    // console.log(xAxisWidth);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        rects
          .push
          // <HelpRect
          //   key={r + " - " + c}
          //   originalWidth={xAxisWidth / columns}
          //   r={r}
          //   c={c}
          //   h={h}
          // />
          ();
      }
    }
    return <g className="help-rects"> {rects}</g>;
  }
}
const dayMillisedons = 1000 * 3600 * 24;
const dateToMilliseconds = date => moment(date).valueOf();

function getDayMilliseconds(date) {
  const m = moment(date).startOf("day");
  // 当天 00:00 时的 milliseconds 值
  const initialTime = m.valueOf();
  return initialTime;
}

/**
 *
 */
const getUsedPositions = (usedTime, initialTime) => {
  const { startTime, endTime } = usedTime;
  const startMilliseconds = dateToMilliseconds(startTime);
  const endMilliseconds = dateToMilliseconds(endTime);
  const deltaTime = startMilliseconds - initialTime;
  const timeStartPoint = deltaTime;
  const timeWidth = endMilliseconds - startMilliseconds;

  return {
    timeStartPoint,
    timeWidth
  };
};

const calcHoc = Comp => {
  const Wrapper = ({
    dataItem,
    xAxisWidth,
    h,
    i,
    awaitStartTime,
    readOnly,
    minLineHeight,
    ...rest
  }) => {
    const { usedTime, avarageValue } = dataItem;
    const awaitStart = dateToMilliseconds(awaitStartTime);
    const awaitEnd = dateToMilliseconds(usedTime.startTime);

    return (
      <GanttStateContext.Consumer>
        {({
          xLeft,
          proption,
          ontimeColors,
          timeoutColors,
          dateTime,
          ...restState
        }) => {
          const { timeStartPoint, timeWidth } = getUsedPositions(
            usedTime,
            dateTime
          );

          const fontSize = readOnly ? 0 : 12;
          const height = readOnly ? minLineHeight : h;
          const deltaX = readOnly ? 0 : xLeft;
          proption = readOnly ? 1 : proption;
          const transform = `translate(${deltaX * -1} ,0)`;

          function calcWidth(time) {
            return time / dayMillisedons * xAxisWidth / proption;
          }

          const usedWidth = calcWidth(timeWidth);
          const avarageWidth = calcWidth(avarageValue);
          const x = calcWidth(timeStartPoint);

          const y = i * height;
          const color = avarageWidth > usedWidth ? ontimeColors : timeoutColors;

          let awaitWidth;

          if (awaitStartTime === -1 || awaitStart > awaitEnd) {
            awaitWidth = 0;
          } else {
            awaitWidth = calcWidth(awaitEnd - awaitStart);
          }

          return (
            <Comp
              x={x}
              color={color}
              transform={transform}
              usedWidth={usedWidth}
              avarageWidth={avarageWidth}
              h={height}
              y={y}
              dataItem={dataItem}
              awaitWidth={awaitWidth}
              usedTime={usedTime}
              calcWidth={calcWidth}
              fontSize={fontSize}
              {...restState}
              {...rest}
            />
          );
        }}
      </GanttStateContext.Consumer>
    );
  };
  function forwardRef(props, ref) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }
  const name = Comp.displayName || Comp.name;
  forwardRef.displayName = `calcProps(${name})`;
  return React.forwardRef(forwardRef);
};

const TaskItems = calcHoc(
  ({
    dataItem,
    x,
    y,
    renderHoverComponent,
    awaitWidth,
    avarageWidth,
    usedWidth,
    color,
    awaitColor,
    h,
    i,
    transform,
    fontSize,
    ...rest
  }) => {
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    // console.log(" taskItems");
    const { avarage, used, highlight } = color;
    return (
      <g fontSize={fontSize} transform={transform}>
        <text y={y + 12} x={x} height={h / 3}>
          {dataItem.name}
        </text>
        <rect
          fill={avarage}
          x={x}
          y={y + h / 3}
          width={avarageWidth}
          height={h / 4}
        />
        <UsedView
          color={used}
          x={x}
          y={usedY}
          width={usedWidth}
          height={usedH}
          highlightPoints={dataItem.highlightPoints}
          dataItem={dataItem}
          renderHoverComponent={renderHoverComponent}
          highlightColor={highlight}
          {...rest}
        />
        {awaitWidth > 10 && (
          <Await
            color={awaitColor}
            width={awaitWidth}
            fontSize={fontSize}
            height={usedH}
            endX={x}
            y={usedY}
            dataItem={dataItem}
            renderHoverComponent={renderHoverComponent}
          />
        )}
      </g>
    );
  }
);

const HightLightPoint = ({
  data,
  renderHoverComponent,
  x,
  y,
  height,
  usedTime,
  calcWidth,
  highlightColor,
  ...rest
}) => {
  const Container = renderHoverComponent.apply(null, [
    ReactGantt.Types.HIGHLIGHT,
    data,
    ...rest
  ]);
  const {
    time,
    onClick,
    getHighLightProps = function({ className = " ", ...rest }) {
      return {
        className: "_highlight_point " + className,
        ...rest
      };
    }
  } = data;
  const { timeWidth } = getUsedPositions({
    startTime: usedTime.startTime,
    endTime: time
  });

  const startX = calcWidth(timeWidth) + x,
    startY = height / 2,
    r = height / 2;

  const children = (
    <g onClick={callAll(onClick)} {...getHighLightProps(data)}>
      <ellipse
        fill={highlightColor}
        rx={r}
        ry={r}
        cx={startX + r}
        cy={startY + y}
      />
    </g>
  );
  // console.log(" hight lisht");

  return React.cloneElement(Container, {}, children);
};

const UsedView = ({ color, highlightPoints = [], ...rest }) => {
  return (
    <React.Fragment>
      <rect fill={color} {...rest} />
      {highlightPoints.map((p, i) => {
        return <HightLightPoint key={p.time} data={p} {...rest} />;
      })}
    </React.Fragment>
  );
};

const Await = ({
  color,
  width,
  height,
  endX,
  fontSize,
  y,
  renderHoverComponent,
  dataItem
}) => {
  const Container = renderHoverComponent(ReactGantt.Types.AWAIT, dataItem);
  const x1 = endX - width,
    y1 = y,
    x2 = x1 + width,
    y2 = y;
  const str = "等待中";

  const children = (
    <React.Fragment>
      <g>
        <line
          strokeWidth="2"
          x1={x1}
          y1={y1}
          x2={x1}
          y2={y2 + height}
          stroke={color}
        />
        <line
          strokeWidth="0.5"
          strokeDasharray={[10, 3]}
          x1={x1}
          y1={y1 + height / 2}
          x2={x2}
          y2={y2 + height / 2}
          stroke={color}
        />
        <line
          strokeWidth="2"
          x1={x1 + width}
          y1={y1}
          x2={x1 + width}
          y2={y2 + height}
          stroke={color}
        />
        <symbol id="_wait_text" viewBox="0 0 100 50">
          <rect x={0} y={-6} fill={"white"} width={50} height={2} />
          <text fill={"black"} x={6} y={0}>
            {str}
          </text>
        </symbol>
        <use
          xlinkHref="#_wait_text"
          x={x1 + width / 2 - fontSize * str.length / 2}
          y={y1}
          width={80}
          height={60}
        />
      </g>
    </React.Fragment>
  );
  return React.cloneElement(Container, null, children);
};

const Datas = ({ readOnly }) => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, xAxisWidth, ...rest }) => {
        const ary = [];
        console.log(" datas ");
        for (let i = 0, length = data.length; i < length; i++) {
          const dataItem = data[i];
          const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
          ary.push(
            <TaskItems
              key={i}
              h={h}
              xAxisWidth={xAxisWidth}
              dataItem={dataItem}
              awaitStartTime={awaitStartTime}
              i={i}
              readOnly={readOnly}
              {...rest}
            />
          );
        }
        return <g id={`tasks-${readOnly ? String("readOnly") : ""}`}>{ary}</g>;
      }}
    </GanttContext.Consumer>
  );
};

class XAxis extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <React.Fragment>
        <HelpRects {...this.props} />
        <defs>{React.createElement(Datas, { readOnly: true })}</defs>
        {React.createElement(Datas)}
      </React.Fragment>
    );
  }
}

class Chart extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { yAxisWidth, xAxisWidth, xAxisHeight, ...rest } = this.props;
    return (
      <svg width={yAxisWidth + xAxisWidth} height={xAxisHeight}>
        <svg width={yAxisWidth}>
          <YAxis {...rest} />
        </svg>
        {/**
          * 
       
          */}
        <svg x={yAxisWidth}>
          <XAxis {...this.props} />
        </svg>
      </svg>
    );
  }
}

export default class ReactGantt extends React.PureComponent {
  static defaultProps = {
    data: [],
    renderHoverComponent: () => <React.Fragment />,
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
  static Types = {
    AWAIT: "__AWAIT",
    TASK: "__TASK",
    HIGHLIGHT: "__HIGHT_LIGHT"
  };

  state = {
    proption: 1,
    xLeft: -1 * 0,
    dateTime: getDayMilliseconds(this.props.date)
  };

  handleChange = ({ xLeft, proption }) => {
    this.setState({
      xLeft
    });
  };

  render() {
    const {
      xAxisHeight,
      timeoutColors,
      ontimeColors,
      awaitColor,
      ...rest
    } = this.props;

    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    return (
      <GanttContext.Provider value={this.props}>
        <GanttStateContext.Provider
          value={{
            ...this.state,
            ontimeColors,
            timeoutColors,
            awaitColor
          }}
        >
          <div>
            <div className="chart-container" style={{ height: xAxisHeight }}>
              <Chart {...this.props} {...this.state} />
            </div>
            <div>
              <Graduation {...rest} {...this.state} />
            </div>
            {/*slide*/}
            <Slide
              {...rest}
              {...this.state}
              onStateChange={this.handleChange}
            />
          </div>
        </GanttStateContext.Provider>
      </GanttContext.Provider>
    );
  }
}

class Slide extends React.PureComponent {
  static defaultProps = {
    stateReducer: (state, change) => change,
    onStateChange: () => {}
  };
  static DragTypes = {
    STRETCH: "__STRETCH__"
  };
  constructor(props) {
    super(props);
    // this.handleXLeftChange = throttle(this.handleXLeftChange, 5 , true)
  }
  state = {
    proption: this.props.proption,
    xLeft: this.props.xLeft
  };

  isControlled = prop => this.props[prop] !== undefined;

  /**
   * 检查 state, 如果 props 中有该 field, 使用 props 的值
   * @param (object ) state
   * @return merged with props
   */
  getState = (state = this.state) => {
    return Object.entries(state).reduce((newObj, [key, value]) => {
      if (this.isControlled(key)) {
        newObj[key] = this.props[key];
      } else {
        newObj[key] = value;
      }
      return newObj;
    }, {});
  };

  internalSetState = (update, callback) => {
    let allChanges;
    this.setState(
      state => {
        const combined = this.getState(state);
        const changes =
          typeof update === "function" ? update(combined) : update;

        // 外部回调的 state
        allChanges = this.props.stateReducer(combined, changes) || {};
        // 过滤 type,
        const { type, ...onlyChanges } = allChanges;

        // 需要过滤掉 props 的 field
        const nonControlledChanges = Object.keys(onlyChanges).reduce(
          (newObject, key) => {
            if (!this.isControlled(key)) {
              if (onlyChanges.hasOwnProperty(key)) {
                newObject[key] = onlyChanges[key];
              } else {
                newObject[key] = combined[key];
              }
            }
            return newObject;
          },
          {}
        );

        return Object.keys(nonControlledChanges || {}).length
          ? nonControlledChanges
          : null;
      },
      () => {
        this.props.onStateChange(allChanges);
        callback && callback();
      }
    );
  };

  handleInputProptionChange = ({ target: { value } }) => {
    // value is float
    this.internalSetState({
      proption: value
    });
  };

  handleInputXChange = ({ target: { value } }) => {
    this.internalSetState({
      xLeft: value * -1
    });
  };

  handleRef = n => {
    this.container = n;
  };

  handleXLeftChange = offset => {
    // 修改 xLeft 和 proption

    // offset =  offset;

    const { xAxisWidth } = this.props;
    const { xLeft, proption } = this.getState();
    const prevWidth = parseFloat(proption) * xAxisWidth;

    let deltaWidth = xLeft + offset;

    if (deltaWidth < 0) {
      deltaWidth = 0;
    } else {
      // deltaWidth = offset
    }

    const currentWidth = prevWidth - deltaWidth;
    const currentProption = currentWidth / xAxisWidth;

    this.internalSetState({
      xLeft: deltaWidth
      // proption: currentProption
    });
    // this.props.onStateChange({xLeft: deltaWidth})
  };
  handleXRightChange = offset => {
    // 修改 proption
  };
  render() {
    const { xAxisWidth, yAxisWidth, minLineHeight, data } = this.props;
    let h = minLineHeight * data.length;
    h = h < 50 ? 50 : h;
    const width = xAxisWidth + yAxisWidth;
    const { proption, xLeft } = this.getState();
    const slideStyle = {
      width: parseFloat(proption) * xAxisWidth,
      // 这里是跟 xAxis 里面相反的方向
      left: +xLeft
    };

    return (
      <div ref={this.handleRef} className="bottom-slide">
        Proption:
        <input
          type="range"
          max="1"
          min="0.01"
          step="0.01"
          defaultValue="1"
          onChange={this.handleInputProptionChange}
        />
        X:
        <input
          type="range"
          max={xAxisWidth}
          min="0"
          defaultValue="0"
          onChange={this.handleInputXChange}
        />
        <svg height={h} width={width}>
          <use xlinkHref="#tasks-readOnly" x={yAxisWidth} y={0} />
        </svg>
        <div
          className="_slide-container"
          style={{
            width: xAxisWidth,
            left: yAxisWidth,
            height: h
          }}
        >
          <div className="_slide" style={slideStyle}>
            <DragStretchPart
              direction="left"
              onChange={this.handleXLeftChange}
            />
            <div className="_move" style={{ width: 200, height: "100%" }} />
            <DragStretchPart
              direction="right"
              onChange={this.handleXRightChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
const tempD = document.createElement("div");

export class StretchPart extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleDraging = throttle(this.handleDraging, 30, true);
  }

  componentDidMount() {
    // this.props.connectDragPreview(getDragPreview())
  }

  componentDidUpdate() {}
  _handleDraging = e => {
    e.persist();
    this.handleDraging(e);
  };
  handleDraging = e => {
    // e.persist();
    const pageX = e.pageX;
    if (this.startX) {
      const diff = pageX - this.startX;
      if (Math.abs(diff) > 500 || diff == 0) {
        return;
      }
      this.props.onChange(diff);
      this.startX = pageX;
    }
  };

  handleDragEnd = e => {
    console.log("-end");
    this.startX = null;
    document.body.removeChild(tempD);
  };
  handleDragStart = e => {
    // e.persist();
    tempD.style.backgroundColor = "red";
    // crt.style.display = "none"; /* or visibility: hidden, or any of the above */
    document.body.appendChild(tempD);
    e.dataTransfer.setDragImage(tempD, 0, 0);
    this.startX = e.pageX;
  };

  render() {
    const { direction, connectDragSource, isDragging } = this.props;
    if (direction == void 0) {
      throw new Error(`must set field: direction`);
    }
    return (
      <div
        draggable={true}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDrag={this._handleDraging}
        style={{
          opacity: isDragging ? 0.5 : 1
        }}
        className={`_stretch ${direction}`}
      />
    );
  }
}

const DragStretchPart =
  // DragSource(Slide.DragTypes.STRETCH, spec, collect)(
  StretchPart;
// );

const Graduation = ({ xAxisWidth, yAxisWidth, proption, dateTime }) => {
  // 每一格子的宽度
  const width = xAxisWidth / columns / proption;
  const h = 12;
  // 如果 每个格子的宽度 < 某个值, 那么 偶数位置的column 则不绘制

  const m = moment(dateTime);
  let str, props;
  const fontSize = 12;
  const children = new Array(columns)
    .fill(0)
    // .filter(filterOdd)
    .map((_, i) => {
      // 内容
      if (i > 0) {
        str = m.add("m", 30).format("HH:mm");
      } else {
        str = m.format("HH:mm");
      }
      const strWidth = (str.length - 1) * fontSize;
      // 计算偏移
      props = {
        x: yAxisWidth + i * width - strWidth / 4,
        key: str,
        children: str,
        y: h,
        fontSize
      };

      if (i % 2 === 1 && width > strWidth) {
        return <text {...props} />;
      } else if (i % 2 === 0) {
        return <text {...props} />;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <svg height={h} width={xAxisWidth + yAxisWidth + 50}>
      {children}
    </svg>
  );
};
