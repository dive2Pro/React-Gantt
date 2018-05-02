import React from "react";
import calcHoc from "./Hoc";
import Used from "./Used";
import Await from "./Await";
import { DEFAULT_EMPTYELEMENT, Types, stateConsumerProps, valueStaticProps, lineProps, RowRectId } from "../../constants";
import {styleUpdateMap} from '../../../StyleMap'


const AvarageRect = valueStaticProps(class AvarageRect extends React.PureComponent {
  componentWillUnmount() {
    if (this.unregister) {
      this.unregister()
    }
  }
  render() {
    let {
      color, h, timeStartPoint, y, avarageValue,
      styleUpdateMap, id,
      proption } = this.props
    id = id + '-avarage-rect'
    function calcCss({ proption, calcWidth }) {
      const x = calcWidth(timeStartPoint, proption)
      const width = calcWidth(avarageValue, proption) + 'px';
      return `
      x:${x};
      width:${width};
    `
    }
    this.unregister = styleUpdateMap.add(id, calcCss)
    return <rect
      data-gantt-id={id}
      fill={color}
      y={y + h / 3}
      height={h / 4}
    />
  }
})

const TaskName = valueStaticProps(class TaskName extends React.PureComponent {
  componentWillUnmount() {
    if (this.unregister) {
      this.unregister()
    }
  }
  render() {
    let {
      startX, y, h, avarageValue, startTime, name, styleUpdateMap, id,
      proption, dateTime, usedTimeWidth
    } = this.props
    id = id + '-task-name-text'
    function calcCss({ proption, startX, calcWidth }, key) {
      const x = calcWidth(startTime)
      let textTranslatex = 0
      const left = startX / proption
      if (left > x) {
        const avarageWidth = calcWidth(avarageValue, proption);
        const usedWidth = calcWidth(usedTimeWidth, proption);
        const textMaxTranslatex = Math.max(avarageWidth, usedWidth)
        textTranslatex = left - x
        if (textTranslatex > textMaxTranslatex) {
          textTranslatex = 0
        }
      }

      const textPlusTransform = `translate(${textTranslatex + x}px, 0)`
      return `
      transform: ${textPlusTransform};
    `
    }
    this.unregister = styleUpdateMap.add(id, calcCss)
    return <text
      data-gantt-id={id}
      y={y + 12} height={h / 3} >
      {name}
    </text>
  }
})

class RowRect extends React.PureComponent {
  render() {
    const { h, y, width } = this.props

    return <rect
      x={0}
      y={y}
      height={h}
      data-gantt-id={RowRectId}
      {...lineProps}
    />
  }
}

class TaskItems extends React.PureComponent {
  componentDidMount() {
    // console.log('-----')
    styleUpdateMap.update()
  }
  render() {
    const {
      dataItem,
      y,
      color,
      awaitColor,
      h,
      awaitEnd,
      awaitStart,
      awaitStartTime,
      fontSize,
      avarageValue,
      usedTimeWidth,
      timeStartPoint,
      TaskHoverContainer,
      AwaitHoverContainer,
      HightLightContainers,
      readOnly,
      index,
      width
    } = this.props
    const usedY = y + h * 2 / 3;
    const usedH = h / 4;
    const { avarage, used, highlight } = color;

    const HoverContainer = React.cloneElement(
      TaskHoverContainer,
      null,
      <g>
        <TaskName id={dataItem.id} readOnly={readOnly} h={h} startTime={timeStartPoint} name={dataItem.name} y={y} avarageValue={avarageValue} usedTimeWidth={usedTimeWidth} />
        <AvarageRect readOnly={readOnly} id={dataItem.id} timeStartPoint={timeStartPoint} y={y} avarageValue={avarageValue} h={h} color={avarage} />
        <Used
          readOnly={readOnly}
          timeWidth={usedTimeWidth}
          timeStartPoint={timeStartPoint}
          dataItem={dataItem}
          highlightColor={highlight}
          color={used}
          y={usedY}
          height={usedH}
          HightLightContainers={HightLightContainers}
        />
      </g>
    );
    return (
      <React.Fragment>
        <RowRect
          h={h}
          y={y}
          width={width} />
        {HoverContainer}
        <Await
          readOnly={readOnly}
          timeStartPoint={timeStartPoint}
          color={awaitColor}
          fontSize={fontSize}
          height={usedH}
          y={usedY}
          dataItem={dataItem}
          AwaitHoverContainer={AwaitHoverContainer}
          awaitStart={awaitStart}
          awaitEnd={awaitEnd}
        />
      </React.Fragment>
    );
  }
}


/**
 *
 */
export default calcHoc(TaskItems);
