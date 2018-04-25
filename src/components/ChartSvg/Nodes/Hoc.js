import React from "react";
import { dateToMilliseconds, getUsedPositions, partialRight } from "./util";
import {
  GanttStateContext,
  dayMillisedons,
} from "../../constants";

class OnlyRenderOnce extends React.Component {
  shouldComponentUpdate() {
    // return !this.props.readOnly;
    return false;
  }

  render() {
    return <React.Fragment>{this.props.children()}</React.Fragment>;
  }
}

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
        ...rest
      }= this.props
        console.log('should not rerender')
        const { usedTime, avarageValue } = dataItem;
        const awaitStart = dateToMilliseconds(awaitStartTime);
        const awaitEnd = dateToMilliseconds(usedTime.startTime);

        let awaitWidth;
        return (
          <GanttStateContext.Consumer>
            {({
              proption,
              dateTime,
              transform,
              xLeft,
              ...restState
            }) => {
              return (
                <OnlyRenderOnce readOnly={readOnly}>
                  {() => {
                    const { timeStartPoint, timeWidth } = getUsedPositions(
                      usedTime,
                      dateTime
                    );

                    transform = readOnly ? "" : transform;
                    proption = readOnly ? 1 : proption;

                    function calcWidth(time) {
                      return time / dayMillisedons * xAxisWidth / proption;
                    }

                    const usedWidth = calcWidth(timeWidth);
                    const avarageWidth = calcWidth(avarageValue);
                    const x = calcWidth(timeStartPoint);

                    if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
                      awaitWidth = 0;
                    } else {
                      awaitWidth = calcWidth(awaitEnd - awaitStart);
                    }


                    const color =
                      avarageWidth > usedWidth ? ontimeColors : timeoutColors;


                    return (
                      <g
                        transform={transform}
                        fontSize={fontSize}
                      >
                        <Comp
                          x={x}
                          fontSize={fontSize}
                          color={color}
                          awaitColor={awaitColor}
                          usedWidth={usedWidth}
                          avarageWidth={avarageWidth}
                          dataItem={dataItem}
                          awaitWidth={awaitWidth}
                          usedTime={usedTime}
                          calcWidth={calcWidth}
                          xLeft={xLeft / proption}
                          startTime={awaitEnd}
                          {...rest}
                        />
                      </g>
                    );
                  }}
                </OnlyRenderOnce>
              );
            }}
          </GanttStateContext.Consumer>
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
