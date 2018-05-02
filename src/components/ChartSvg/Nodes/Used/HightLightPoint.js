import React from "react";
import { callAll, calcTimeDelta } from "../util";
import { Types, DEFAULT_EMPTYELEMENT, valueStaticProps } from "../../../constants";


const Ellipse = valueStaticProps(class Ellipse extends React.PureComponent {
  componentDidMount() {
    // console.log(`Ellipse didmount`)
  }
  componentWillUnmount() {
    if(this.unregister) {
      this.unregister()
    }
  }
  render() {
    const { color, r, time, y, parentId, readOnly, dateTime, styleUpdateMap } = this.props

    function calcCss({ proption, calcWidth }) {
      const timeWidth = calcTimeDelta(time, dateTime)
      const startX = calcWidth(timeWidth);
      return `
      cx: ${startX + r};
    `
    }
    const id = parentId + '' + time
    this.unregister = styleUpdateMap.add(id, calcCss)

    return <ellipse
      data-gantt-id={readOnly || id}
      fill={color}
      rx={r}
      ry={r}
      cy={r + y}
    />
  }
}
)


const HightLightPoint = ({
  data,
  Container,
  y,
  height,
  startTime,
  color,
  timeStartPoint,
  parentId,
  readOnly,
}) => {
  const { time, onClick, getHighLightProps = () => ({}) } = data;
  function innerGetProps() {
    const { className = " ", ...rest } = getHighLightProps(data);
    return {
      className: "_highlight_point " + className,
      ...rest
    };
  }
  const timeWidth = calcTimeDelta(time,
    startTime
  )

  const r = height / 2;

  const children = (
    <g {...innerGetProps()} onClick={callAll(onClick)}>
      <Ellipse parentId={parentId} r={r} color={color} time={time}
        readOnly={readOnly}
        y={y}
      />
    </g>
  );
  // console.log(" hight lisht");

  return React.cloneElement(Container, {}, children);
};

export default HightLightPoint;
