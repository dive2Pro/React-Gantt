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
        {({ xLeft, proption, transform }) => {
          let y = h * r;
          const width = originalWidth / proption;
          let x = width * c;
          return (
            <rect
              transform={transform}
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
