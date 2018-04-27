import React from "react";
import { GanttContext, 
  DEFAULT_EMPTYELEMENT,
  Types,
  NodesGId
 } from "../../constants";
import Tasks from "./Tasks";
import {partialLeft} from './util'

export default class Nodes extends React.Component {
  constructor(props) {
    super(props)
    
    console.log(props.readOnly , ' = readOnly  constructor')

  }

  componentDidMount() {
    console.log(this.props.readOnly , ' = readOnly componentDidMount')
  }
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
          for (let i = 0, length = data.length; i < length; i++) {
            const dataItem = data[i];
            const awaitStartTime = i > 0 ? data[i - 1].usedTime.endTime : -1;
            const y = i * height;
            ary.push(
              <Tasks
                key={i}
                h={height}
                y={y}
                index={i}
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
          const transform = readOnly ? "" : null; // No
          
          return (
            <g id={`${NodesGId}${readOnly ? String("readOnly") : ""}`}
            data-gantt-id={readOnly || NodesGId}
            transform={transform}
            >{ary}</g>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}
