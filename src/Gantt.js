import React from "react";
const GanttContext = React.createContext({});

const YAxis = () => {
  return (
    <GanttContext.Consumer>
      {({ data, lineHeight: h, yAxisWidth }) => {
        const startX = 0,
          startY = 0;
        return data.map(({ name }, i) => {
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
      {({
        yAxisWidth: ox,
        lineHeight: h,
        proption,
        xLeft,
        data,
        xAxisWidth
      }) => {
        const columns = 48;
        const rows = data.length;
        let rects = [];
        const width = xAxisWidth / columns / proption;
        for (let r = 0; r < rows; r++) {
          let y = h * r;
          for (let c = 0; c < columns; c++) {
            let x = ox + width * c;
            rects.push(
              <rect
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

class XAxis extends React.Component {
  render() {
    return (
      <GanttContext.Consumer>
        {({ yAxisWidth: ox, data, lineHeight: h }) => {
          return (
            <React.Fragment>
              <HelpRects />
            </React.Fragment>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}

class Chart extends React.PureComponent {
  render() {
    const { yAxisWidth, xAxisWidth, xAxisHeight } = this.props;
    return (
      <svg width={yAxisWidth + xAxisWidth} height={xAxisHeight}>
        <YAxis />
        <XAxis />
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
    xLeft: 0
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
