import React from "react";
import moment from "moment";

const GanttContext = React.createContext({});

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
      {({ lineHeight: h, proption, xLeft, data, xAxisWidth }) => {
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
    </GanttContext.Consumer>
  );
};

const Datas = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, xAxisWidth }) => {
        const m = moment(data[0].usedTime.startTime).startOf("day");
        // const s = moment(date[0].usedTime.startTime).startOf('day');
        console
          .log
          // m.get('millisecond'),
          // m.get('month')
          ();
        const initialTime = m.valueOf();
        const dayMillisedons = 1000 * 3600 * 24;

        return data.map(({ name, usedTime }, i) => {
          // 计算 x
          //   1. x 轴 原点是 这一天的 起点时间
          //   2. deltaTime = startTime - initialTime
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
          //   5. AWait 组件的终点是 initialX, 宽度是 此任务和上一个任务的 时间间隔
          //   6

          return (
            <React.Fragment key={name}>
              <g>
                <text y={i * h + 12} fontSize={12} x={0} height={h / 3}>
                  {name}
                </text>
                <rect
                  x={initialX}
                  y={i * h + h / 3}
                  width={initialWidth}
                  height={h / 3}
                />
              </g>
            </React.Fragment>
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
  state = {
    proption: 1,
    xLeft: -1 * 0
  };
  render() {
    const { xAxisHeight, ...rest } = this.props;
    return (
      <GanttContext.Provider value={{ ...this.state, ...rest }}>
        <div>
          <div className="chart-container" style={{ height: xAxisHeight }}>
            <Chart {...this.props} />
          </div>
          <div>{/*刻度 */}</div>
          <div>{/*slide*/}</div>
        </div>
      </GanttContext.Provider>
    );
  }
}
