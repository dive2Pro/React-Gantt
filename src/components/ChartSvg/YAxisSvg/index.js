import React from "react";

const YAxis = ({ data, lineHeight: h, yAxisWidth }) => {
  const startX = 0,
    startY = 0;
  return data.map(({ YAxis: name }, i) => {
    return (
      <React.Fragment key={name + " - " + i}>
        <g>
          <rect
            fill={"white"}
            x={startX}
            y={startY + h * i}
            width={yAxisWidth}
            height={h}
          />
          <text x={yAxisWidth / 2 - 50 / 2} y={startY + h / 2 + 23 / 4 + h * i}>
            {name}
          </text>
        </g>
      </React.Fragment>
    );
  });
};

export default class YAxisSvg extends React.PureComponent {
  render() {
    const { yAxisWidth, ...rest } = this.props;
    return (
      <svg width={yAxisWidth}>
        <YAxis {...rest} />
      </svg>
    );
  }
}
