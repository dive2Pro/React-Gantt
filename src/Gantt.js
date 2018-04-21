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

const getInital = ({ xAxisWidth, usedTime }) => {
  const m = moment(usedTime.startTime).startOf("day");
  const initialTime = m.valueOf();
  const { startTime, endTime } = usedTime;
  const startMilliseconds = moment(startTime).valueOf();
  const endMilliseconds = moment(endTime).valueOf();
  const deltaTime = startMilliseconds - initialTime;
  //   3. 总长度是固定的 xAxisWidth, 所以 x / xAxisWidth = deltaTime / fullDayTime 这里的 x = initialX
  const widthProption = deltaTime / dayMillisedons;
  const initialX = widthProption * xAxisWidth;

  //   4. 同样的方式 拿到 initialWidth
  const initialWidth =
    (endMilliseconds - startMilliseconds) / dayMillisedons * xAxisWidth;

  return {
    initialX,
    initialWidth
  };
};

const calcHoc = Comp => {
  const Wrapper = ({ dataItem, xAxisWidth, h, i, ...rest }) => {
    const { initialX, initialWidth } = getInital({
      xAxisWidth,
      usedTime: dataItem.usedTime
    });
    return (
      <GanttStateContext.Consumer>
        {({ xLeft, proption, readOnly }) => {
          const deltaX = xLeft;
          const transform = `translate(${deltaX} ,0)`;
          const width = initialWidth / proption;
          const x = initialX / proption;
          const height = readOnly ? 2 : h;
          const y = i * h;
          return (
            <Comp
              x={x}
              transform={transform}
              width={width}
              h={height}
              y={y}
              dataItem={dataItem}
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

const TaskItems = calcHoc(({ dataItem, x, y, width, h, i }) => {
  return (
    <g>
      <text y={y + 12} fontSize={12} x={x} height={h / 3}>
        {dataItem.name}
      </text>
      <rect x={x} y={y + h / 3} width={width} height={h / 3} />
    </g>
  );
});

const Datas = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, xAxisWidth }) => {
        const m = moment(data[0].usedTime.startTime).startOf("day");
        const initialTime = m.valueOf();
        return data.map((dataItem, i) => {
          //  将 g 封入一个 Component 中, 只对 StateConsumer 中的数据变化反应
          return (
            <TaskItems
              key={i}
              h={h}
              xAxisWidth={xAxisWidth}
              dataItem={dataItem}
              i={i}
            />
          );
        });
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
    hoverComponent: () => <React.Fragment />,
    timeoutColor: "#FFE7BA",
    ontimeColor: "#52C41A",
    lineHeight: 50,
    yAxisWidth: 100,
    xAxisWidth: 750,
    xAxisHeight: 1000
  };
  constructor(props) {
    super(props);
  }
  state = {
    proption: 1,
    xLeft: -1 * 0
  };
  render() {
    const { xAxisHeight, ...rest } = this.props;
    // 分离两个 Provider , 一个提供 Root Props, 一个提供 Root State
    return (
      <GanttContext.Provider value={{ ...rest }}>
        <GanttStateContext.Provider value={{ ...this.state }}>
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
