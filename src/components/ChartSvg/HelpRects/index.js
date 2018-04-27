import React from "react";
import { columns, GanttContext, GanttValueStaticContext, GanttStateContext, lineProps, HelpRectColumnPrefix, HelpRectRowId } from "../../constants";

const RowLine = ({ xAxisWidth, y, h }) => {
  return <GanttValueStaticContext.Consumer>
    {() => <rect
      {...lineProps}
      x="0"
      y={y}
      height={h}
      data-gantt-id={HelpRectRowId}
    />}
  </GanttValueStaticContext.Consumer>
}
const ColumnLine = ({ h, i }) =>
  <GanttValueStaticContext.Consumer>
    {({ props: {
      styleUpdateMap
    } }) => {
      const id = HelpRectColumnPrefix + '-' + i
      function calcCss({ helpRectWidth }) {
        return {
          x: helpRectWidth * i
        }
      }
      styleUpdateMap.add(id, calcCss)
      return <rect
        {...lineProps}
        y={0}
        width={0.1}
        height={h}
        data-gantt-id={id}
      />
    }}
  </GanttValueStaticContext.Consumer>

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
          for (let r = 0; r < rows; r++) {
            rects.push(
              <RowLine
                key={'row - ' + r}
                xAxisWidth={xAxisWidth}
                h={h}
                y={r * h}
              />
            );
          }
          for (let c = 0; c < columns; c++) {
            rects.push(
              <ColumnLine
                key={'column - ' + c}
                h={h * rows}
                i={c}
              />
            );
          }
      console.log('--help')
          
          return (
            <GanttValueStaticContext.Consumer>
              {({ props: { styleUpdateMap } }) => {
                const id = 'help-rect-container'
                function calcCss({ transform }) {
                  return {
                    transform
                  }
                }
                styleUpdateMap.add(id, calcCss)
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
