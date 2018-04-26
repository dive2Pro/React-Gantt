import React from "react";

const calcHoc = Comp => {
  const Wrapper = ({ proption, startX, index = 0, readOnly, ...rest }) => {
    // 0. height & y 是不会变化的
    // 1. 当比例变小的时候, deltaX 是不会变化
    // 2. startX 变化的时候, width 是不会变化的
    // 3. 渲染的时候 有一个 initial值 { initialX, initialWidth }
    // 4. 计算的时候就用这几个值
    const initialX = 50 * index + 50,
      initialWidth = 50;
    // const x = initialX - startX; // 不是这样得出 x 值, 我们需要将漫游器 (想象是一个望远镜) 显示某个位置的, 而不是移动目标位置的效果
    const deltaX = startX;
    const transform = `translate(${deltaX} ,0)`;
    const width = initialWidth / proption;
    // (1 - proption) * initialWidth
    // initialWidth / proption - initialWidth = (1 / proption - 1) * intialWidth
    const deltaWidth = width - initialWidth;
    const x = initialX / proption;
    const height = readOnly ? 2 : 50;
    const y = readOnly ? 4 * index : 50 * index;
    return (
      <Comp
        height={height}
        x={x}
        transform={transform}
        width={width}
        y={y}
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

const ChangeRect = calcHoc(({ transform, x, width, height, y }) => {
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
      y={y}
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
        cy={50}
        rx={20}
        ry={20}
      />
    </g>
  );
});

export const ID = "@@Gantt";
export const ID_READONLY = ID + "-ReadOnly";
class Inner extends React.Component {
  shouldComponentUpdate(...args) {
    const { readOnly } = this.props;
    return !readOnly;
  }
  render() {
    const props = this.props;
    const id = props.readOnly ? ID + "-ReadOnly" : ID;
    return (
      <symbol id={id} viewBox="0 0 750 550">
        <ChangeRect {...props} />
        <ChangeRect {...props} index={1} />
        <ChangeRect {...props} index={16} />
        <Dot {...props} />
      </symbol>
    );
  }
}

const HalfHour = props => {
  return (
    <React.Fragment>
      <defs>
        <Inner {...props} />
        <Inner {...props} readOnly />
      </defs>
      <use href={"#" + ID} x="0" y="0" width="750" height="550" />
    </React.Fragment>
  );
};
export { HalfHour, ChangeRect, Dot };
