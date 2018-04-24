import React from "react";
import { columns, moment } from "./constants";

const Graduation = ({
  xAxisWidth,
  leftWidth,
  transform,
  proption,
  dateTime
}) => {
  // 每一格子的宽度
  const width = xAxisWidth / columns / proption;
  const h = 12;
  // 如果 每个格子的宽度 < 某个值, 那么 偶数位置的column 则不绘制
  const m = moment(dateTime);
  let str, props;
  const fontSize = 12;
  const children = new Array(columns)
    .fill(0)
    // .filter(filterOdd)
    .map((_, i) => {
      // 内容
      if (i > 0) {
        str = m.add("m", 30).format("HH:mm");
      } else {
        str = m.format("HH:mm");
      }
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
    <svg height={h} width={xAxisWidth + leftWidth + 50}>
      {children}
      <rect fill={"white"} width={leftWidth - 20} height={h} />
    </svg>
  );
};

export default Graduation;
