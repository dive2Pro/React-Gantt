import React from "react";
import moment from "moment";

const GanttContext = React.createContext({});
const GanttStateContext = React.createContext({});

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

const HelpRects = () => {
  return (
    <GanttContext.Consumer>
      {({ lineHeight: h, data, xAxisWidth }) => {
        return (
          <GanttStateContext.Consumer>
            {({ xLeft, proption }) => {
              const columns = 48;
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

const getUsedPositions = usedTime => {
  const m = moment(usedTime.startTime).startOf("day");
  const initialTime = m.valueOf();
  const { startTime, endTime } = usedTime;
  const startMilliseconds = moment(startTime).valueOf();
  const endMilliseconds = moment(endTime).valueOf();

  const deltaTime = startMilliseconds - initialTime;
  const timeStartPoint = deltaTime;
  const timeWidth = endMilliseconds - startMilliseconds;

  return {
    timeStartPoint,
    timeWidth
  };
};

const dateToMilliseconds = date => moment(date).valueOf();

const calcHoc = Comp => {
  const Wrapper = ({ dataItem, xAxisWidth, h, i, awaitStartTime, ...rest }) => {
    const { usedTime, avarageValue } = dataItem;
    const { timeStartPoint, timeWidth } = getUsedPositions(usedTime);

    return (
      <GanttStateContext.Consumer>
        {({ xLeft, proption, readOnly, ontimeColor, timeoutColor }) => {
          const deltaX = xLeft;
          const transform = `translate(${deltaX} ,0)`;
          const calcWidth = time => {
            return time / dayMillisedons * xAxisWidth / proption;
          };

          const usedWidth = calcWidth(timeWidth);
          const avarageWidth = calcWidth(avarageValue);
          const x = calcWidth(timeStartPoint);

          const height = readOnly ? 2 : h;
          const y = i * h;
          const color = avarageWidth > usedWidth ? ontimeColor : timeoutColor;

          let awaitWidth;
          const awaitStart = dateToMilliseconds(awaitStartTime);
          const awaitEnd = dateToMilliseconds(usedTime.startTime);

          if (awaitStartTime === -1 || awaitStart > awaitEnd) {
            awaitWidth = 0;
          } else {
            console.log(awaitStart, awaitEnd);
            awaitWidth = calcWidth(awaitEnd - awaitStart);
            console.log(awaitWidth);
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
    h,
    i
  }) => {
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    return (
      <g>
        <text y={y + 12} fontSize={10} x={x} height={h / 3}>
          {dataItem.name}
        </text>
        <rect x={x} y={y + h / 3} width={avarageWidth} height={h / 4} />
        <rect x={x} y={usedY} width={usedWidth} height={usedH} />
        <Await
          color={color}
          width={awaitWidth}
          height={usedH}
          endX={x}
          y={usedY}
          renderHoverComponent={renderHoverComponent}
        />
      </g>
    );
  }
);

const Await = ({ color, width, height, endX, y, renderHoverComponent }) => {
  const Container = renderHoverComponent(ReactGantt.Types.AWAIT);

  const x1 = endX - width,
    y1 = y,
    x2 = x1 + width,
    y2 = y;
  const children = (
    <g>
      {width > 0 && (
        <line
          strokeWidth="0.5"
          strokeDasharray={[10, 3]}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={"red"}
        />
      )}
    </g>
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
    timeoutColor: "#FFE7BA",
    ontimeColor: "#52C41A",
    lineHeight: 50,
    yAxisWidth: 100,
    xAxisWidth: 750,
    xAxisHeight: 1000
  };
  static Types = {
    AWAIT: "__AWAIT",
    TASK: "__TASK"
  };
  constructor(props) {
    super(props);
  }
  state = {
    proption: 1,
    xLeft: -1 * 0
  };
  render() {
    const { xAxisHeight, timeoutColor, ontimeColor, ...rest } = this.props;
    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    return (
      <GanttContext.Provider value={{ ...rest }}>
        <GanttStateContext.Provider
          value={{ ...this.state, ontimeColor, timeoutColor }}
        >
          <div>
            <div className="chart-container" style={{ height: xAxisHeight }}>
              <Chart {...this.props} />
            </div>
            <div>{/*刻度 */}</div>
            <div>{/*slide*/}</div>
          </div>
        </GanttStateContext.Provider>
      </GanttContext.Provider>
    );
  }
}
