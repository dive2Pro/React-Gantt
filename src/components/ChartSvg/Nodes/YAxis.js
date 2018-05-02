import React from "react";


export const YAxisView = ({leftWidth, name, y, h }) => {
  const FONTSIZE = 16;

  const textX = leftWidth - name.trim().length * FONTSIZE;
    return (
        <g>
          <rect
            fill={"white"}
            x={0}
            y={y}
            width={leftWidth}
            height={h}
          />
          <text
          // text 置中
            textAnchor="middle"
            transform={`translate(${leftWidth /2 } ,0)`}
            y={y + h / 2 + 23 / 4 }>
            {name}
          </text>
        </g>
    );
}

