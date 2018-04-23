import React from "react";

export default function DragSvg({ h }) {
  const rectWidth = 14,
    rectHeight = h - 10,
    height = h,
    xDelta = 3,
    yDelta = 4,
    startY = 2;
  const rectY = (height - rectHeight) / 2;
  return (
    <svg>
      <g stroke="#b2bbb2cc" fill="#b2bbb2cc">
        <rect
          fill="#b2bbb233"
          stroke="transparent"
          x={0}
          y={0}
          width={rectWidth}
          height={h}
        />
        <line
          x1={rectWidth / 2}
          x2={rectWidth / 2}
          y1={startY}
          y2={height - startY}
        />
        <rect
          rx="2"
          ry="2"
          x={0}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
        />
        <line
          x1={rectWidth / 2 - xDelta}
          x2={rectWidth / 2 - xDelta}
          y1={rectY + yDelta}
          y2={rectY + rectHeight - yDelta}
          stroke="white"
        />
        <line
          x1={rectWidth / 2 + xDelta}
          x2={rectWidth / 2 + xDelta}
          y1={rectY + yDelta}
          y2={rectY + rectHeight - yDelta}
          stroke="white"
        />
      </g>
    </svg>
  );
}
