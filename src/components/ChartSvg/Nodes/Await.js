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
  const deltaTime = awaitEnd - awaitStart;
  const idFixed = awaitStartTime + '-' + deltaTime
  const str = "等待中";
  const leftLineId = id + '-await-left-line-' + idFixed
  const rightLineId = id + '-await-right-line-' + idFixed
  const lineId = id + '-await-middle-line-' + idFixed
  const textId = id + '-await-text-id-' + idFixed

  const showAwait = awaitStart < awaitEnd - 10
  if (!showAwait) {
    return ""
  }
  const halfFontWidth = fontSize * str.length / 2
  if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
    return null
  }
  function calcCss({ calcWidth }, key) {
    let endX = calcWidth(timeStartPoint)
    let width = calcWidth(deltaTime);
    let h = height
    let x = endX - width
    let ty = y
    if (key === leftLineId) {
      width = 0.1
    } else
      if (key === rightLineId) {
        x = endX;
        width = 0.1
      } else
        if (key === lineId) {
          ty = y + height / 2
          h = 0.05
        }
        else
          if (key === textId) {
            return `
        transform: translate(${ x + width / 2 - halfFontWidth}px,0)
      `
          }

    return `
      x:${x};
      y:${ty};
      width: ${width}px;
      height: ${h}px;
    `
  }
  // styleUpdateMap.addArray([leftLineId, rightLineId, lineId, textId])
  styleUpdateMap.add(leftLineId, calcCss)
  styleUpdateMap.add(rightLineId, calcCss)
  styleUpdateMap.add(lineId, calcCss)
  styleUpdateMap.add(textId, calcCss)
  return <g>
    <rect
      strokeWidth="2"
      data-gantt-id={leftLineId}
      stroke={color}
    />
    <rect
      fillOpacity={0}
      stroke={color}
      data-gantt-id={lineId}
      strokeWidth="0.5"
      strokeDasharray={[10, 3]}
    />
    <rect
      data-gantt-id={rightLineId}
      strokeWidth="2"
      stroke={color}
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
    />
  </g>
}

)

const Await = ({ AwaitHoverContainer, ...props }
) => {
  return React.cloneElement(AwaitHoverContainer, null, <AwaitView {...props} />);
};

export default Await;
