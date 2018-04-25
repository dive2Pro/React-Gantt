import React from "react";
import YAxisSvg from "./YAxisSvg";
import XAxisSvg from "./XAxisSvg";
import {GanttValueStaticContext} from '../constants'
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
        <GanttValueStaticContext.Consumer>
          {
            () => {
              console.log('-- rerender')
              return 'asd'
            }
          }
          </GanttValueStaticContext.Consumer>
      </svg>
    );
  }
}

export default Chart;
