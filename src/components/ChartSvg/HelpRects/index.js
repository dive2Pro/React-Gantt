import React from "react";
import {
  columns,GanttValueStaticContext, GanttStateContext,
  specifyPropsWithStateConsumer,
  lineProps, HelpRectColumnPrefix, HelpRectRowId
} from "../../constants";

const ColumnLine = ({ h, i, columnWidth, leftWidth, offset }) =>
  <GanttStateContext.Consumer>
    {({ proption, helpRectWidth }) => {
      return <line
        {...lineProps}
        y1={offset}
        y2={h + offset}
        x1={helpRectWidth * i + leftWidth}
        x2={helpRectWidth * i + leftWidth}
      />
    }}
  </GanttStateContext.Consumer>

class HelpRects extends React.PureComponent {
  render() {
    const { height, width, leftWidth, offset } = this.props
    const columnWidth = width / columns
    let rects = [];
    for (let c = 0; c < columns; c++) {
      rects.push(
        <ColumnLine
          key={'column - ' + c}
          h={height}
          columnWidth={columnWidth}
          leftWidth={leftWidth}
          offset={offset}
          i={c}
        />
      );
    }
    return <g
      className="help-rects"> {
        rects
      }</g>;
  }
}
export default HelpRects;
