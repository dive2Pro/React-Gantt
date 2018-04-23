import React from "react";
import { callAll, getUsedPositions } from "../util";
import { Types } from "../../../constants";
const HightLightPoint = ({
  data,
  renderHoverComponent,
  x,
  y,
  height,
  usedTime,
  calcWidth,
  highlightColor,
  ...rest
}) => {
  const Container = renderHoverComponent.apply(null, [
    Types.HIGHLIGHT,
    data,
    ...rest
  ]);
  const { time, onClick, getHighLightProps = () => ({}) } = data;
  function innerGetProps() {
    const { className = " ", ...rest } = getHighLightProps(data);
    return {
      className: "_highlight_point " + className,
      ...rest
    };
  }
  const { timeWidth } = getUsedPositions({
    startTime: usedTime.startTime,
    endTime: time
  });

  const startX = calcWidth(timeWidth) + x,
    startY = height / 2,
    r = height / 2;

  const children = (
    <g {...innerGetProps()} onClick={callAll(onClick)}>
      <ellipse
        fill={highlightColor}
        rx={r}
        ry={r}
        cx={startX + r}
        cy={startY + y}
      />
    </g>
  );
  // console.log(" hight lisht");

  return React.cloneElement(Container, {}, children);
};

export default HightLightPoint;
