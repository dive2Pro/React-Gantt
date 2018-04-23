import React from "react";
import YAxisSvg from "./YAxisSvg";
import XAxisSvg from "./XAxisSvg";
class Chart extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { yAxisWidth, xAxisWidth, lineHeight, data } = this.props;
    return (
      <svg width={yAxisWidth + xAxisWidth} height={lineHeight * data.length}>
        <YAxisSvg {...this.props} />
        <XAxisSvg yAxisWidth={yAxisWidth} />
      </svg>
    );
  }
}

export default Chart;
