import React from "react";
import { dateToMilliseconds, getUsedPositions } from "./util";
import { GanttStateContext, dayMillisedons } from "../../constants";

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
          xLeft,
          proption,
          ontimeColors,
          timeoutColors,
          dateTime,
          transform,
          slideHeight,
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
                // const deltaX = readOnly ? 0 : xLeft;
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

                if (awaitStartTime === -1 || awaitStart > awaitEnd) {
                  awaitWidth = 0;
                } else {
                  awaitWidth = calcWidth(awaitEnd - awaitStart);
                }

                return (
                  <Comp
                    x={x}
                    color={color}
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
                    renderHoverComponent={renderHoverComponent}
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
