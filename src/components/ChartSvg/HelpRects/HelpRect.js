import React from "react";
import { GanttStateContext } from "../../constants";

export default class HelpRect extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { r, c, h, originalWidth } = this.props;
    return (
      <GanttStateContext.Consumer>
        {({ proption, transform }) => {
          let y = h * r;
          const width = originalWidth / proption;
          let x = width * c;
          return (
            <rect
              fill={"#fff"}
              x={x}
              y={y}
              width={width}
              height={h}
            />
          );
        }}
      </GanttStateContext.Consumer>
    );
  }
}
