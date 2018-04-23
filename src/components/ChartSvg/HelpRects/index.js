import React from "react";
import HelpRect from "./HelpRect";

import { columns, GanttContext } from "../../constants";

class HelpRects extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <GanttContext.Consumer>
        {({ lineHeight: h, data, xAxisWidth }) => {
          const rows = data.length;
          const originalWidth = xAxisWidth / columns;
          let rects = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
              rects.push(
                <HelpRect
                  key={r + " - " + c}
                  originalWidth={originalWidth}
                  r={r}
                  c={c}
                  h={h}
                />
              );
            }
          }
          return <g className="help-rects"> {rects}</g>;
        }}
      </GanttContext.Consumer>
    );
  }
}
export default HelpRects;
