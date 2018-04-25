import React from "react";
import { callAll, calcTimeDelta } from "../util";
import { Types, DEFAULT_EMPTYELEMENT, stateConsumerProps } from "../../../constants";

const Ellipse = stateConsumerProps(function Ellipse({ color, r, time, y, proption, calcWidth, dateTime }) {
  const timeWidth = calcTimeDelta(time, dateTime)
  const startX = calcWidth(timeWidth, proption);
  return <ellipse
    fill={color}
    rx={r}
    ry={r}
    cx={startX + r}
    cy={r + y}
  />
}
)

const HightLightPoint = ({
  data,
  Container,
  y,
  height,
  startTime,
  color,
  timeStartPoint,
}) => {

  const { time, onClick, getHighLightProps = () => ({}) } = data;
  function innerGetProps() {
    const { className = " ", ...rest } = getHighLightProps(data);
    return {
      className: "_highlight_point " + className,
      ...rest
    };
  }
  const timeWidth = calcTimeDelta(time,
    startTime
  )

  const r = height / 2;

  const children = (
    <g {...innerGetProps()} onClick={callAll(onClick)}>
      <Ellipse r={r} color={color} time={time}
        y={y}
      />
    </g>
  );
  // console.log(" hight lisht");

  return React.cloneElement(Container, {}, children);
};

export default HightLightPoint;
