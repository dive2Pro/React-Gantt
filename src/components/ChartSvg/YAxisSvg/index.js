import React from "react";

const YAxis = ({ data, lineHeight: h, leftWidth }) => {
  const startX = 0,
    startY = 0;
  const FONTSIZE = 16;

  return data.map(({ YAxis: name }, i) => {
    const textX = leftWidth - name.trim().length * FONTSIZE;
    return (
        <g key={name + " - " + i}>
          <rect
            fill={"white"}
            x={startX}
            y={startY + h * i}
            width={leftWidth}
            height={h}
          />
          <text
          // text 置中
            textAnchor="middle"
            transform={`translate(${leftWidth /2 } ,0)`}
            y={startY + h / 2 + 23 / 4 + h * i}>
            {name}
          </text>
        </g>
    );
  });
};

export default class YAxisSvg extends React.PureComponent {
  render() {
    const { leftWidth, chartHeight, ...rest } = this.props;
    return (
      <svg width={leftWidth}>
        <YAxis {...this.props} />
      </svg>
    );
  }
}
