import React from "react";
import HelpRect from "./HelpRect";

import { columns, GanttContext, GanttStateContext } from "../../constants";

class HelpRects extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const lineProps = {
      stroke: "blue",
      strokeWidth: 0.2,
      strokeOpacity: 0.5,
      strokeDasharray: [5, 3],
      strokeDashoffset: 2
    };
    return (
      <GanttContext.Consumer>
        {({ lineHeight: h, data, xAxisWidth, chartHeight }) => {
          return (
            <GanttStateContext.Consumer>
              {({ proption, transform }) => {
                const rows = data.length;
                const originalWidth = xAxisWidth / columns;
                let rects = [];
                for (let r = 0; r < rows; r++) {
                  rects.push(
                    <line
                      key={'row - ' + r}
                      {...lineProps}
                      transform={transform}
                      x1="0"
                      x2={xAxisWidth / proption}
                      y1={r * h}
                      y2={r * h}
                    />
                  );
                }
                for (let c = 0; c < columns; c++) {
                  const x = originalWidth * c / proption;
                  rects.push(
                    <line
                      key={'column - ' + c}                    
                      {...lineProps}
                      transform={transform}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={chartHeight}
                    />
                  );
                }
                return <g className="help-rects"> {rects}</g>;
              }}
            </GanttStateContext.Consumer>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}
export default HelpRects;
