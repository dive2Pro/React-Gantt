import React from "react";

const calcHoc = Comp => {
  const Wrapper = ({ proption, xLeft, index, ...rest }) => {
    // 0. height & y 是不会变化的
    // 1. 当比例变小的时候, deltaX 是不会变化
    // 2. xLeft 变化的时候, width 是不会变化的
    // 3. 渲染的时候 有一个 initial值 { initialX, initialWidth }
    // 4. 计算的时候就用这几个值
    const initialX = 200,
      initialWidth = 100;
    // const x = initialX - xLeft; // 不是这样得出 x 值, 我们需要将漫游器 (想象是一个望远镜) 显示某个位置的, 而不是移动目标位置的效果
    const deltaX = xLeft;
    const transform = `translate(${deltaX} ,0)`;
    const width = initialWidth / proption;

    return (
      <Comp
        height={50}
        x={200 * index}
        transform={transform}
        width={width}
        {...rest}
      />
    );
  };
  function forwardRef(props, ref) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }
  const name = Comp.displayName || Comp.name;
  forwardRef.displayName = `calcProps(${name})`;
  return React.forwardRef(forwardRef);
};

const ChangeRect = calcHoc(({ transform, x, width, height }) => {
  return (
    <rect
      id="help-rect"
      onClick={() => {
        alert("hello");
      }}
      onMouseEnter={() => {
        console.log("onMouseEnter");
      }}
      onMouseLeave={() => {
        console.log("leave");
      }}
      fill={"blue"}
      transform={transform}
      x={x}
      y="100"
      width={width}
      height={height}
    />
  );
});

const Dot = calcHoc(({ transform, x, width, height }) => {
  return (
    <g id="dot">
      <ellipse
        onClick={() => {
          alert("Dot");
        }}
        fill={"pink"}
        cx={x}
        cy={100}
        rx={20}
        ry={20}
      />
    </g>
  );
});

const HalfHour = props => {
  return (
    <React.Fragment>
      <defs>
        <symbol id="render" viewBox="0 0 750 550">
          <ChangeRect {...props} />
          <ChangeRect {...props} index={2} />
          <Dot {...props} />
        </symbol>
      </defs>
      <use href="#render" x="0" y="00" width="750" height="550" />
    </React.Fragment>
  );
};
export { HalfHour, ChangeRect, Dot };
