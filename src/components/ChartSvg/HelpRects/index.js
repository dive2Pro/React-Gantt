import React from "react";
import { columns, GanttContext, GanttValueStaticContext, GanttStateContext,
  HalfHours,
  specifyPropsWithStateConsumer,
  lineProps, HelpRectColumnPrefix, HelpRectRowId } from "../../constants";

const ColumnLine = ({ h, i, columnWidth, leftWidth, offset}) =>
  <GanttStateContext.Consumer>
    {({ proption, helpRectWidth}) => {
      const id = HelpRectColumnPrefix + '-' + i
      function calcCss({ helpRectWidth }, id) {
        return `
          x: ${helpRectWidth * i}
        `
      }
      return <line
        {...lineProps}
        y1={offset}
        y2={h + offset}
        x1={helpRectWidth * i + leftWidth}
        x2={helpRectWidth * i + leftWidth}
        data-gantt-id={id}
      />
    }}
  </GanttStateContext.Consumer>

class HelpRects extends React.PureComponent {
 
  render() {
    const { height, width, proption, leftWidth, offset} = this.props
    const columns = HalfHours.length
    const columnWidth = width /columns 
    return (
      <GanttContext.Consumer>
        {({ lineHeight: h, data, xAxisWidth, chartHeight }) => {
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
          return (
            <GanttValueStaticContext.Consumer>
              {({ props: { styleUpdateMap } }) => {
                const id = 'help-rect-container'
                function calcCss({ transform }, id) {
                  return `transform:${transform}`
                }
                // styleUpdateMap.add(id, calcCss)
                return <g
                  data-gantt-id={id}
                  className="help-rects"> {
                    rects
                  }</g>;
              }}
            </GanttValueStaticContext.Consumer>
          );
        }}
      </GanttContext.Consumer>
    );
  }
}
export default HelpRects;
