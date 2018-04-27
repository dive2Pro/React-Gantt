import React from "react";
import { Types, DEFAULT_EMPTYELEMENT, stateConsumerProps, valueStaticProps } from "../../constants";


const AwaitView = valueStaticProps(function AwaitView({
  color, height, awaitStartTime,
  timeStartPoint,
  awaitStart,
  awaitEnd,
  y,
  fontSize,
  proption,
  calcWidth,
  styleUpdateMap,
  dataItem: { id }
}) {
  const str = "等待中";
  const leftLineId = id + '-await-left-line-' + y
  const rightLineId = id + '-await-right-line-' + y
  const lineId = id + '-await-middle-line-' + y
  const textId = id + '-await-text-id-' + y

  const showAwait = awaitStart < awaitEnd - 10
  if (!showAwait) {
    return ""
  }

  const halfFontWidth = fontSize * str.length / 2
  function calcCss(proption, key) {
    let endX = calcWidth(timeStartPoint)
    let width
    if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
      width = 0;
    } else {
      width = calcWidth(awaitEnd - awaitStart);
    }
    
    let h = height
    let x = endX - width
    let ty = y
    if (key === leftLineId) {
      width = 0.1
    }
    if (key === rightLineId) {
      x = endX;
      width = 0.1
    }
    if (key === lineId) {
      ty = y + height / 2
      h = 0.05
    }

    if (key === textId) {
      // return {
      //   x: x1 + width / 2 - halfFontWidth,
      //   y: y1
      // }
      return {
        transform: `translate(${ x + width / 2 - halfFontWidth}px,0)`
      }
    }

    return {
      x,
      y: ty,
      width: width + 'px',
      height: h + 'px'
    }
  }

  const leftInLinecss =
    styleUpdateMap ? (styleUpdateMap.add(leftLineId, calcCss), {}) :
      calcCss(proption, leftLineId);
  const rightInLinecss =
    styleUpdateMap ? (styleUpdateMap.add(rightLineId, calcCss), {}) :
      calcCss(proption, rightLineId);
  const lineInlinecss =
    styleUpdateMap ? (styleUpdateMap.add(lineId, calcCss), {}) :
      calcCss(proption, lineId);
  const textInLinecss =
    styleUpdateMap ? (styleUpdateMap.add(textId, calcCss), {}) :
      calcCss(proption, textId);

  return <g>
    <rect
      strokeWidth="2"
      data-gantt-id={leftLineId}
      stroke={color}
      {...leftInLinecss}
    />
    <rect
      fillOpacity={0}
      stroke={color}
      data-gantt-id={lineId}
      strokeWidth="0.5"
      strokeDasharray={[10, 3]}
      {...lineInlinecss}
    />
    <rect
      data-gantt-id={rightLineId}
      strokeWidth="2"
      stroke={color}
      {...rightInLinecss}
    />
    <symbol id="_wait_text" viewBox="0 0 100 50">
      <rect x={0} y={-6} fill={"white"} width={50} height={2} />
      <text fill={"black"} x={6} y={0}>
        {str}
      </text>
    </symbol>
    <use
      data-gantt-id={textId}
      xlinkHref="#_wait_text"
      width={80}
      height={60}
      y={y}
      {...textInLinecss}
    />
  </g>
}

)

const Await = ({ AwaitHoverContainer, ...props }
) => {
  return React.cloneElement(AwaitHoverContainer, null, <AwaitView {...props} />);
};

export default Await;
