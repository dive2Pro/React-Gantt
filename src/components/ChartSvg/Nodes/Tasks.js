import React from "react";
import calcHoc from "./Hoc";
import Used from "./Used";
import Await from "./Await";
import { DEFAULT_EMPTYELEMENT, Types } from "../../constants";
const TaskItems =
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
    transform,
    fontSize,
    xLeft,
    ...rest
  }) => {
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    // console.log(" taskItems");
    const { avarage, used, highlight } = color;
    let HoverContainer 
    = renderHoverComponent.apply(null, [
      Types.TASK,
      dataItem,
      used
    ]);
    let textTranslatex = 0

    if (!React.isValidElement(HoverContainer)) {
      HoverContainer = <DEFAULT_EMPTYELEMENT />;
    }
    if (xLeft > x) {
      const textMaxTranslatex = Math.max(avarageWidth, usedWidth)
      textTranslatex = xLeft - x
      if (textTranslatex > textMaxTranslatex) {
        textTranslatex = 0
      }
    }

    const textPlusTransform = `translate(${textTranslatex} , 0)`

    HoverContainer = React.cloneElement(
      HoverContainer,
      null,
      <g>
        <g transform={textPlusTransform}>
          <text y={y + 12} x={x} height={h / 3}>
            {dataItem.name}
          </text>
        </g>
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
          dataItem={dataItem}
          renderHoverComponent={renderHoverComponent}
          highlightColor={highlight}
          {...rest}
        />
      </g>
    );
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }


/**
 *
 */
export default calcHoc(TaskItems);
