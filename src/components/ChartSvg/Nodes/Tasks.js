import React from "react";
import calcHoc from "./Hoc";
import Used from "./Used";
import Await from "./Await";
import { DEFAULT_EMPTYELEMENT, Types, stateConsumerProps } from "../../constants";


const AvarageRect = stateConsumerProps(function AvarageRect({
  color, h, timeStartPoint, y, avarageValue,
  proption, calcWidth }) {
  const x = calcWidth(timeStartPoint, proption)
  const width = calcWidth(avarageValue, proption);
  return <rect
    fill={color}
    x={x}
    y={y + h / 3}
    width={width}
    height={h / 4}
  />
})

const TaskName = stateConsumerProps(function TaskName({
  xLeft, y, h, avarageValue, startTime, name,
  proption, calcWidth, dateTime
}) {
  const avarageWidth = calcWidth(avarageValue, proption);
  const usedWidth = calcWidth(usedWidth , proption);
  const x = calcWidth(startTime, proption)
  let textTranslatex = 0
  const left = xLeft / proption
  if (left > x) {
    const textMaxTranslatex = Math.max(avarageWidth, usedWidth)
    textTranslatex = left - x
    if (textTranslatex > textMaxTranslatex) {
    textTranslatex = 0
    }
  }
  const textPlusTransform = `translate(${textTranslatex} , 0)`

  return <g transform={textPlusTransform}>
    <text y={y + 12} x={x} height={h / 3}>
      {name}
    </text>
  </g>
})

class TaskItems extends React.PureComponent {
  render() {
    const {
      xLeft,
      dataItem,
      y,
      color,
      awaitColor,
      h,
      awaitEnd,
      awaitStart,
      awaitStartTime,      
      fontSize,
      avarageValue,
      usedTimeWidth,
      timeStartPoint,
      TaskHoverContainer,
      AwaitHoverContainer,
      HightLightContainers,
      readOnly
    } = this.props
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    // console.log(" taskItems");
    const { avarage, used, highlight } = color;

    const HoverContainer = React.cloneElement(
      TaskHoverContainer,
      null,
      <g>
        <TaskName readOnly={readOnly} h={h} startTime={timeStartPoint} name={dataItem.name} y={y} avarageValue={avarageValue} usedTimeWidth={usedTimeWidth} />
        <AvarageRect readOnly={readOnly} timeStartPoint={timeStartPoint} y={y} avarageValue={avarageValue} h={h} color={avarage} />
        <Used
          readOnly={readOnly}
          timeWidth={usedTimeWidth}
          timeStartPoint={timeStartPoint}
          dataItem={dataItem}
          highlightColor={highlight}
          color={used}
          y={usedY}
          height={usedH}
          HightLightContainers={HightLightContainers}
        />
      </g>
    );
    return (
      <React.Fragment>
        {HoverContainer}
        <Await
          readOnly={readOnly}
          timeStartPoint={timeStartPoint}
          color={awaitColor}
          fontSize={fontSize}
          height={usedH}
          y={usedY}
          dataItem={dataItem}
          AwaitHoverContainer={AwaitHoverContainer}
          awaitStart={awaitStart}
          awaitEnd={awaitEnd}
        />
      </React.Fragment>
    );
  }
}


/**
 *
 */
export default calcHoc(TaskItems);
