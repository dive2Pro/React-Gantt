import React from "react";
import { dateToMilliseconds, getUsedPositions, partialRight, calcTimeDelta} from "./util";
import {
  GanttStateContext,
  dayMillisedons,
  GanttValueStaticContext,
  DEFAULT_EMPTYELEMENT,
  Types
} from "../../constants";

const calcHoc = Comp => {
  class Wrapper extends React.PureComponent {
    render() {
      const {
        dataItem,
        xAxisWidth,
        awaitStartTime,
        readOnly,
        minLineHeight,
        dataLength,
        fontSize,
        timeoutColors,
        ontimeColors,
        awaitColor,
        renderHoverComponent,
        y,
        lineHeight: h,
        width
      } = this.props
      const { usedTime, avarageValue } = dataItem;
      const awaitStart = dateToMilliseconds(awaitStartTime);
      const awaitEnd = dateToMilliseconds(usedTime.startTime);
      let TaskHoverContainer = renderHoverComponent.apply(null, [
        Types.TASK,
        dataItem
      ]);

      let AwaitHoverContainer = renderHoverComponent.apply(null, [
        Types.AWAIT,
        dataItem
      ]);


      if (!React.isValidElement(TaskHoverContainer)) {
        TaskHoverContainer = <DEFAULT_EMPTYELEMENT />;
      }
      if (!React.isValidElement(AwaitHoverContainer)) {
        AwaitHoverContainer = <DEFAULT_EMPTYELEMENT />;
      }
      const HightLightContainers = {};
      (dataItem.highlightPoints || []).map((p, i) => {
        let Container = renderHoverComponent.apply(null, [
          Types.HIGHLIGHT,
          p
        ]);

        if (!React.isValidElement(Container)) {
          Container = <DEFAULT_EMPTYELEMENT />;
        }
        HightLightContainers[p.time] = Container
      })
      const Consumer = readOnly ? GanttValueStaticContext.Consumer : GanttStateContext.Consumer;
      return (
        <Consumer>
          {(value) => {
            let {
              dateTime, 
              calcWidth,
            } = readOnly ? value.props : value;

            const timeStartPoint = calcTimeDelta(usedTime.startTime, dateTime); 
            const timeWidth = calcTimeDelta(usedTime.endTime, usedTime.startTime); 
            const color =
              avarageValue > timeWidth ? ontimeColors : timeoutColors; 
            return (
              <g>
                <Comp
                  dataItem={dataItem}
                  y={y}                  
                  awaitColor={awaitColor}
                  color={color}
                  h={h}
                  awaitStartTime={awaitStartTime}
                  awaitStart={awaitStart}
                  awaitEnd={awaitEnd}
                  fontSize={fontSize}
                  avarageValue={avarageValue}
                  usedTimeWidth={timeWidth}
                  timeStartPoint={timeStartPoint}
                  TaskHoverContainer={TaskHoverContainer}
                  AwaitHoverContainer={AwaitHoverContainer}
                  HightLightContainers={HightLightContainers}
                  readOnly={readOnly}
                  width={width}
                />
              </g>
            );
          }
          }
        </Consumer>
      );
    };
  }

  function forwardRef(props, ref) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }
  const name = Comp.displayName || Comp.name;
  forwardRef.displayName = `calcProps(${name})`;
  // return React.forwardRef(forwardRef);
  return Wrapper
};

export default calcHoc;
