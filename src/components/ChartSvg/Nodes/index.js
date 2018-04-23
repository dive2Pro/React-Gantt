import React from "react";
import { GanttContext } from "../../constants";
import Tasks from "./Tasks";
export default class Nodes extends React.Component {
  render() {
    const { readOnly } = this.props;
    return (
      <GanttContext.Consumer>
        {({ data, lineHeight: h, xAxisWidth, transform, ...rest }) => {
          const ary = [];
          for (let i = 0, length = data.length; i < length; i++) {
            const dataItem = data[i];
            const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
            ary.push(
              <Tasks
                key={i}
                h={h}
                dataLength={length}
                xAxisWidth={xAxisWidth}
                dataItem={dataItem}
                awaitStartTime={awaitStartTime}
                i={i}
                readOnly={readOnly}
                {...rest}
              />
            );
          }
          return (
            <g id={`tasks-${readOnly ? String("readOnly") : ""}`}>{ary}</g>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}
