import React from "react";
import { columns, HalfHours } from "./constants";

const Graduation = ({
  xAxisWidth,
  leftWidth,
  transform,
  proption
}) => {
  // 每一格子的宽度
  const width = xAxisWidth / columns / proption;
  const h = 12;
  // 如果 每个格子的宽度 < 某个值, 那么 偶数位置的column 则不绘制
  let props;
  const fontSize = 12;
  const children = HalfHours
    // .filter(filterOdd)
    .map((str, i) => {
      // 内容
      const strWidth = (str.length - 1) * fontSize;
      // 计算偏移
      props = {
        x: leftWidth + i * width - strWidth / 4,
        key: str,
        children: str,
        y: h,
        fontSize,
        transform
      };

      if (i % 2 === 1 && width > strWidth) {
        return <text {...props} />;
      } else if (i % 2 === 0) {
        return <text {...props} />;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return (
    <svg height={h} width={xAxisWidth + leftWidth}>
      {children}
      <rect fill={"white"} width={leftWidth - 20} height={h} />
    </svg>
  );
};

export default Graduation;
