import React from "react";
import { HalfHours } from "./constants";

const Graduation = ({
  xAxisWidth,
  leftWidth,
  helpRectWidth,
  startX,
  proption
}) => {
  // 每一格子的宽度
  const width = helpRectWidth;
  const h = 12;
  // 如果 每个格子的宽度 < 某个值, 那么 偶数位置的column 则不绘制
  let props;
  const fontSize = 12;
  const strWidth = (HalfHours[0].length - 1) * fontSize;
  const children = HalfHours
    .map((str, i) => {
      // 内容
      // 计算偏移
      props = {
        x: leftWidth + i * width - strWidth / 4 - startX / proption,
        key: str,
        children: str,
        y: h,
        fontSize,
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
    <svg height={h} width={xAxisWidth + leftWidth + strWidth / 2}>
      {children}
      <rect fill={"white"} width={leftWidth - 20} height={h} />
    </svg>
  );
};

export default Graduation;
