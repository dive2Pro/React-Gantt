import React from "react";
import { Types, DEFAULT_EMPTYELEMENT, stateConsumerProps } from "../../constants";


const AwaitView = stateConsumerProps(function AwaitView({
  color, height, awaitStartTime,
  timeStartPoint,
  awaitStart,
  awaitEnd,
  y,
  fontSize,
  proption, calcWidth
}) {
  const str = "等待中";
  let width
  if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
    width = 0;
  } else {
    width = calcWidth(awaitEnd - awaitStart, proption);
  }
  const endX = calcWidth(timeStartPoint , proption)
  const x1 = endX - width,
    y1 = y,
    x2 = x1 + width,
    y2 = y;

  return width && <g>
    <line
      strokeWidth="2"
      x1={x1}
      y1={y1}
      x2={x1}
      y2={y2 + height}
      stroke={color}
    />
    <line
      strokeWidth="0.5"
      strokeDasharray={[10, 3]}
      x1={x1}
      y1={y1 + height / 2}
      x2={x2}
      y2={y2 + height / 2}
      stroke={color}
    />
    <line
      strokeWidth="2"
      x1={x1 + width}
      y1={y1}
      x2={x1 + width}
      y2={y2 + height}
      stroke={color}
    />
    <symbol id="_wait_text" viewBox="0 0 100 50">
      <rect x={0} y={-6} fill={"white"} width={50} height={2} />
      <text fill={"black"} x={6} y={0}>
        {str}
      </text>
    </symbol>
    <use
      xlinkHref="#_wait_text"
      x={x1 + width / 2 - fontSize * str.length / 2}
      y={y1}
      width={80}
      height={60}
    />
  </g>}

)

const Await = ({ AwaitHoverContainer, ...props }
) => {
  return React.cloneElement(AwaitHoverContainer, null, <AwaitView {...props} />);
};

export default Await;
