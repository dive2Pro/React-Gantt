import React from "react";
import { dateToMilliseconds, getUsedPositions, partialRight } from "./util";
import {
  GanttStateContext,
  dayMillisedons,
  DEFAULT_EMPTYELEMENT
} from "../../constants";

class OnlyRenderOnce extends React.Component {
  shouldComponentUpdate() {
    return !this.props.readOnly;
  }

  render() {
    // console.log(' this.props = ' , this.props.readOnly)
    return <React.Fragment>{this.props.children()}</React.Fragment>;
  }
}

const calcHoc = Comp => {
  const Wrapper = ({
    dataItem,
    xAxisWidth,
    h,
    i,
    awaitStartTime,
    readOnly,
    minLineHeight,
    dataLength,
    renderHoverComponent,
  
    ...rest
  }) => {
    const { usedTime, avarageValue } = dataItem;
    const awaitStart = dateToMilliseconds(awaitStartTime);
    const awaitEnd = dateToMilliseconds(usedTime.startTime);

    return (
      <GanttStateContext.Consumer>
        {({
          proption,
          dateTime,
          transform,
          slideHeight,
          xLeft,
          awaitColor,
          ontimeColors,
          timeoutColors,
          ...restState
        }) => {
          return (
            <OnlyRenderOnce readOnly={readOnly}>
              {() => {
                const { timeStartPoint, timeWidth } = getUsedPositions(
                  usedTime,
                  dateTime
                );
                const fontSize = readOnly ? 0 : 12;
                const height = readOnly ? slideHeight / dataLength : h;
                transform = readOnly ? "" : transform;
                proption = readOnly ? 1 : proption;

                function calcWidth(time) {
                  return time / dayMillisedons * xAxisWidth / proption;
                }

                const usedWidth = calcWidth(timeWidth);
                const avarageWidth = calcWidth(avarageValue);
                const x = calcWidth(timeStartPoint);

                const y = i * height;
                const color =
                  avarageWidth > usedWidth ? ontimeColors : timeoutColors;

                let awaitWidth;

                if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
                  awaitWidth = 0;
                } else {
                  awaitWidth = calcWidth(awaitEnd - awaitStart);
                }
                renderHoverComponent = readOnly
                  ? DEFAULT_EMPTYELEMENT
                  : renderHoverComponent;
                return (
                  <Comp
                    x={x}
                    color={color}
                    awaitColor={awaitColor}
                    usedWidth={usedWidth}
                    avarageWidth={avarageWidth}
                    h={height}
                    y={y}
                    dataItem={dataItem}
                    awaitWidth={awaitWidth}
                    usedTime={usedTime}
                    calcWidth={calcWidth}
                    fontSize={fontSize}
                    transform={transform}
                    xLeft={xLeft / proption}
                    renderHoverComponent={renderHoverComponent}
                    startTime={awaitEnd}
                  />
                );
              }}
            </OnlyRenderOnce>
          );
        }}
      </GanttStateContext.Consumer>
    );
  };
  function forwardRef(props, ref) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }
  const name = Comp.displayName || Comp.name;
  forwardRef.displayName = `calcProps(${name})`;
  return React.forwardRef(forwardRef);
};

export default calcHoc;
