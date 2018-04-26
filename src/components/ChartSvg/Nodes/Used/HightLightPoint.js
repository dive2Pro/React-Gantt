import React from "react";
import { callAll, calcTimeDelta } from "../util";
import { Types, DEFAULT_EMPTYELEMENT, valueStaticProps } from "../../../constants";


const Ellipse = valueStaticProps(function Ellipse({ color, r, time, y, proption, calcWidth, parentId, readOnly, dateTime, sm }) {
  function calcStyle(proption) {
    const timeWidth = calcTimeDelta(time, dateTime)
    const startX = calcWidth(timeWidth, proption);
    
    return {
      cx: startX + r,
    }
  }
  const id =  parentId + '' + time
  const inlinecss = sm && readOnly ? (sm.add(id, calcStyle), {}) : calcStyle(proption);
  
  return <ellipse
    data-gantt-id={ readOnly || id}
    fill={color}
    rx={r}
    ry={r}
    cy={r + y}
    {...inlinecss}
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
  parentId,
  readOnly,
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
      <Ellipse parentId={parentId} r={r} color={color} time={time}
      readOnly={readOnly}
        y={y}
      />
    </g>
  );
  // console.log(" hight lisht");

  return React.cloneElement(Container, {}, children);
};

export default HightLightPoint;
