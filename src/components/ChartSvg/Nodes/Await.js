import React from "react";
import { Types } from "../../constants";
const Await = ({
  color,
  width,
  height,
  endX,
  fontSize,
  y,
  renderHoverComponent,
  dataItem
}) => {
  const Container = renderHoverComponent(Types.AWAIT, dataItem);
  const x1 = endX - width,
    y1 = y,
    x2 = x1 + width,
    y2 = y;
  const str = "等待中";

  const children = (
    <React.Fragment>
      <g>
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
      </g>
    </React.Fragment>
  );
  return React.cloneElement(Container, null, children);
};

export default Await;
