import React from "react";
import { GanttContext, 
  DEFAULT_EMPTYELEMENT,
  Types
 } from "../../constants";
import Tasks from "./Tasks";
import {partialLeft} from './util'

export default class Nodes extends React.Component {
  render() {
    const { readOnly } = this.props;
    return (
      <GanttContext.Consumer>
        {({ data, lineHeight: h, xAxisWidth,
        renderHoverComponent,
         slideHeight, ...rest }) => {
          const ary = [];
          const dataLength = data.length;
          const height = readOnly ? slideHeight / dataLength : h;
          const fontSize = readOnly ? 0 : 12;
          renderHoverComponent = readOnly
          ? DEFAULT_EMPTYELEMENT
          : renderHoverComponent;

          // renderHoverComponent = Object.values(Types).reduce((p,v) => {
            
          // }, {})
          for (let i = 0, length = data.length; i < length; i++) {
            const dataItem = data[i];
            const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
            const y = i * height;
            ary.push(
              <Tasks
                key={i}
                h={height}
                y={y}
                xAxisWidth={xAxisWidth}
                dataItem={dataItem}
                awaitStartTime={awaitStartTime}
                readOnly={readOnly}
                fontSize={fontSize}
                renderHoverComponent={renderHoverComponent}
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
