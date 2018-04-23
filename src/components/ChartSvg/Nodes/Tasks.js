import React from "react";
import calcHoc from "./Hoc";
import Used from "./Used";
import Await from "./Await";
import { DEFAULT_EMPTYELEMENT, Types } from "../../constants";
const TaskItems = calcHoc(
  ({
    dataItem,
    x,
    y,
    renderHoverComponent,
    awaitWidth,
    avarageWidth,
    usedWidth,
    color,
    awaitColor,
    h,
    i,
    transform,
    fontSize,
    ...rest
  }) => {
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    // console.log(" taskItems");
    const { avarage, used, highlight } = color;
    let HoverContainer = renderHoverComponent.apply(null, [
      Types.TASK,
      dataItem,
      used
    ]);
    if (!React.isValidElement(HoverContainer)) {
      HoverContainer = <DEFAULT_EMPTYELEMENT />;
    }

    HoverContainer = React.cloneElement(
      HoverContainer,
      null,
      <g>
        <text y={y + 12} x={x} height={h / 3}>
          {dataItem.name}
        </text>
        <rect
          fill={avarage}
          x={x}
          y={y + h / 3}
          width={avarageWidth}
          height={h / 4}
        />
        <Used
          color={used}
          x={x}
          y={usedY}
          width={usedWidth}
          height={usedH}
          highlightPoints={dataItem.highlightPoints}
          dataItem={dataItem}
          renderHoverComponent={renderHoverComponent}
          highlightColor={highlight}
          {...rest}
        />
      </g>
    );
    return (
      <g fontSize={fontSize} transform={transform}>
        {HoverContainer}
        {awaitWidth > 10 && (
          <Await
            color={awaitColor}
            width={awaitWidth}
            fontSize={fontSize}
            height={usedH}
            endX={x}
            y={usedY}
            dataItem={dataItem}
            renderHoverComponent={renderHoverComponent}
          />
        )}
      </g>
    );
  }
);

/**
 *
 */
export default TaskItems;
