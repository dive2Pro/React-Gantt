import React from "react";
import HelpRect from "./HelpRect";

import { columns, GanttContext, GanttStateContext, lineProps } from "../../constants";

const RowLine = ({ xAxisWidth, y }) => {
  return <GanttStateContext.Consumer>
    {({ proption }) => <line
      {...lineProps}
      x1="0"
      x2={xAxisWidth / proption}
      y1={y}
      y2={y}
    />}
  </GanttStateContext.Consumer>
}
const ColumnLine = ({ h, i, initialWidth }) =>
  <GanttStateContext.Consumer>
    {({ proption, transform }) => {
      const x = initialWidth * i / proption;
      return <line
        {...lineProps}
        x1={x}
        x2={x}
        y1={0}
        y2={h}
      />
    }}
  </GanttStateContext.Consumer>

class HelpRects extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <GanttContext.Consumer>
        {({ lineHeight: h, data, xAxisWidth, chartHeight }) => {
          let rects = [];
          const rows = data.length;
          const initialWidth = xAxisWidth / columns;
          for (let r = 0; r < rows; r++) {
            rects.push(
              <RowLine
                key={'row - ' + r}
                xAxisWidth={xAxisWidth}
                y={r * h}
              />
            );
          }
          for (let c = 0; c < columns; c++) {
            rects.push(
              <ColumnLine
                key={'column - ' + c}
                initialWidth={initialWidth}
                h={chartHeight}
                i={c}
              />
            );
          }
          return (
            <GanttStateContext.Consumer>
              {({ proption, transform }) => {
                return <g
                  transform={transform}
                  className="help-rects"> {
                    rects
                  }</g>;
              }}
            </GanttStateContext.Consumer>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}
export default HelpRects;
