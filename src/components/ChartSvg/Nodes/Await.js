import React from "react";
import { Types, DEFAULT_EMPTYELEMENT, stateConsumerProps } from "../../constants";


const AwaitView = stateConsumerProps(function AwaitView({
  color, height, awaitStartTime,
  timeStartPoint,
  awaitStart,
  awaitEnd,
  y,
  fontSize,
  proption, 
  calcWidth,
  sm,
  dataItem: { id }
}) {
  const str = "等待中";
  const leftLineId = id + '-await-left-line'
  const rightLineId = id + '-await-right-line'
  const lineId = id + '-await-middle-line'
  const textId = id + '-await-text-id'
  function calcCss(proption, startX, key) {
    let width
    if (Number.isNaN(awaitStartTime) || awaitStartTime === -1 || awaitStart > awaitEnd) {
      width = 0;
    } else {
      width = calcWidth(awaitEnd - awaitStart, proption);
    }
    let endX = calcWidth(timeStartPoint, proption)
    let x1 = endX - width
    let y2 = y,
      y1 = y,
      x2 = x1 + width
    if (key === leftLineId) {
      y2 = y2 + height
    }
    if(key === rightLineId) {
      y1 = y1 + height / 2
      y2 = y2 + height / 2

    }
    if(key === lineId) {
      x2 = x1 + width
      x1 = x1 + width
      y2 = y2 + height
      
    }
    if(key === textId ){
      return {x : x1 + width / 2 - fontSize * str.length / 2 , 
      y: y1
      }

    }
    return {
      x1: x1 + 'px',
      y1: y1 + 'px',
      y2: y2 + 'px',
      x2: x2  + 'px',
    }
  }
  const leftInLinecss = 
    // sm ? (sm.add(leftLineId, calcCss), {}) : 
    calcCss(proption, leftLineId);
  const rightInLinecss =
  //  sm ? (sm.add(rightLineId, calcCss), {}) : 
    calcCss(proption, rightLineId);
  const lineInlinecss = 
  // sm ? (sm.add(lineId, calcCss), {}) :
   calcCss(proption, lineId);
  const textInLinecss =
  //  sm ? (sm.add(textId, calcCss), {}) :
    calcCss(proption, textId);

  return <g>
    <line
      strokeWidth="2"
      data-gantt-id={leftLineId}
      stroke={color}
      {...leftInLinecss}
    />
    <line
      data-gantt-id={rightLineId}    
      strokeWidth="0.5"
      strokeDasharray={[10, 3]}
      stroke={color}
      {...rightInLinecss}
    />
    <line
      data-gantt-id={lineId}      
      strokeWidth="2"
      stroke={color}
      {...lineInlinecss}
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
      {...textInLinecss}
    />
  </g>
}

)

const Await = ({ AwaitHoverContainer, ...props }
) => {
  // return React.cloneElement(AwaitHoverContainer, null, <AwaitView {...props} />);
  return ""
};

export default Await;
