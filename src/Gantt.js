import React from "react";
import moment from "moment";

const GanttContext = React.createContext({});
const GanttStateContext = React.createContext({});

function callAll(...fns) {
  return function eventHandle(...args) {
    fns.filter(Boolean).forEach(fn => {
      fn.apply(null, args);
    });
  };
}
const YAxis = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, yAxisWidth }) => {
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

const HelpRects = () => {
  return (
    <GanttContext.Consumer>
      {({ lineHeight: h, data, xAxisWidth }) => {
        return (
          <GanttStateContext.Consumer>
            {({ xLeft, proption }) => {
              const rows = data.length;
              let rects = [];
              const width = xAxisWidth / columns / proption;
              const transform = `translate( ${xLeft}, 0)`;
              for (let r = 0; r < rows; r++) {
                let y = h * r;
                for (let c = 0; c < columns; c++) {
                  let x = width * c;
                  rects.push(
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
                }
              }
              return rects;
            }}
          </GanttStateContext.Consumer>
        );
      }}
    </GanttContext.Consumer>
  );
};
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
  const Wrapper = ({ dataItem, xAxisWidth, h, i, awaitStartTime, ...rest }) => {
    const { usedTime, avarageValue } = dataItem;

    return (
      <GanttStateContext.Consumer>
        {({
          xLeft,
          proption,
          readOnly,
          ontimeColors,
          timeoutColors,
          dateTime,
          ...restState
        }) => {
          const { timeStartPoint, timeWidth } = getUsedPositions(
            usedTime,
            dateTime
          );

          const deltaX = xLeft;
          const transform = `translate(${deltaX} ,0)`;
          function calcWidth(time) {
            return time / dayMillisedons * xAxisWidth / proption;
          }

          const usedWidth = calcWidth(timeWidth);
          const avarageWidth = calcWidth(avarageValue);
          const x = calcWidth(timeStartPoint);

          const height = readOnly ? 2 : h;
          const y = i * h;
          const color = avarageWidth > usedWidth ? ontimeColors : timeoutColors;

          let awaitWidth;
          const awaitStart = dateToMilliseconds(awaitStartTime);
          const awaitEnd = dateToMilliseconds(usedTime.startTime);

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
    ...rest
  }) => {
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;

    const { avarage, used, highlight } = color;
    return (
      <g transform={transform}>
        <text y={y + 12} fontSize={10} x={x} height={h / 3}>
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
  y,
  renderHoverComponent,
  dataItem
}) => {
  const Container = renderHoverComponent(ReactGantt.Types.AWAIT, dataItem);
  const x1 = endX - width,
    y1 = y,
    x2 = x1 + width,
    y2 = y;
  const fontSize = 12;
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
          <text fill={"black"} x={6} y={0} fontSize={fontSize}>
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

const Datas = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, xAxisWidth, ...rest }) => {
        const m = moment(data[0].usedTime.startTime).startOf("day");
        const initialTime = m.valueOf();
        const ary = [];
        for (let i = 0, length = data.length; i < length; i++) {
          const dataItem = data[i];
          const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
          ary.push(
            <React.Fragment key={i}>
              <TaskItems
                key={i}
                h={h}
                xAxisWidth={xAxisWidth}
                dataItem={dataItem}
                awaitStartTime={awaitStartTime}
                i={i}
                {...rest}
              />
            </React.Fragment>
          );
        }
        return ary;
      }}
    </GanttContext.Consumer>
  );
};

class XAxis extends React.Component {
  render() {
    return (
      <React.Fragment>
        <HelpRects />
        <Datas />
      </React.Fragment>
    );
  }
}

class Chart extends React.PureComponent {
  render() {
    const { yAxisWidth, xAxisWidth, xAxisHeight } = this.props;
    return (
      <svg width={yAxisWidth + xAxisWidth} height={xAxisHeight}>
        <svg width={yAxisWidth}>
          <YAxis />
        </svg>
        <svg x={yAxisWidth}>
          <XAxis />
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
    xAxisHeight: 200
  };
  static Types = {
    AWAIT: "__AWAIT",
    TASK: "__TASK",
    HIGHLIGHT: "__HIGHT_LIGHT"
  };
  constructor(props) {
    super(props);
  }
  state = {
    proption: 1,
    xLeft: -1 * 0,
    dateTime: getDayMilliseconds(this.props.date)
  };
  handleInputProptionChange = ({ target: { value } }) => {
    // value is float
    this.setState({
      proption: value
    });
  };
  handleInputXChange = ({ target: { value } }) => {
    this.setState({
      xLeft: value * -1
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
      <GanttContext.Provider value={{ ...rest }}>
        <GanttStateContext.Provider
          value={{
            ...this.state,
            ontimeColors,
            timeoutColors,
            awaitColor
          }}
        >
          <div>
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
              max={rest.xAxisWidth}
              min="0"
              defaultValue="0"
              onChange={this.handleInputXChange}
            />
            <div className="chart-container" style={{ height: xAxisHeight }}>
              <Chart {...this.props} />
            </div>
            <div>
              <Graduation {...rest} {...this.state} />
            </div>
            <div>{/*slide*/}</div>
          </div>
        </GanttStateContext.Provider>
      </GanttContext.Provider>
    );
  }
}

const Graduation = ({ xAxisWidth, yAxisWidth, proption, dateTime }) => {
  // 每一格子的宽度
  const width = xAxisWidth / columns / proption;
  const h = 12;
  // 如果 每个格子的宽度 < 某个值, 那么 偶数位置的column 则不绘制
  function filterOdd() {
    return true;
  }
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
        stroke: "black",
        y: h,
        strokeWidth: "0.1",
        fontSize
      };

      if (i % 2 == 1 && width > strWidth) {
        // console.log(i);
        return <text {...props} />;
      } else if (i % 2 == 0) {
        return <text {...props} />;
      }
    })
    .filter(Boolean);

  return (
    <svg height={h} width={xAxisWidth + yAxisWidth}>
      {children}
    </svg>
  );
};
