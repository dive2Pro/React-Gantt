import React from "react";
import YAxisSvg from "./YAxisSvg";
import XAxisSvg from "./XAxisSvg";
class Chart extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { leftWidth, xAxisWidth, lineHeight, data } = this.props;
    return (
      <svg width={leftWidth + xAxisWidth} height={lineHeight * data.length}>
        <YAxisSvg {...this.props} />
        <XAxisSvg leftWidth={leftWidth} />
      </svg>
    );
  }
}

export default Chart;
