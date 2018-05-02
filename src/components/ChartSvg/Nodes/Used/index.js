import React from "react";
import HightLightPoint from "./HightLightPoint";
import { valueStaticProps } from '../../../constants'

const UserRect = valueStaticProps(class UserRect extends React.PureComponent {
  componentWillUnmount() {
    if(this.unregister) {
      this.unregister()
    }
  }
  render() {
    const { timeWidth, timeStartPoint,
      styleUpdateMap, parentId, x, width, readOnly, data, ...rectProps } = this.props
    const id = parentId + '-userrect-' + timeStartPoint
    function calcCss({ proption, calcWidth }) {
      return `
      x: ${calcWidth(timeStartPoint)};
      width: ${calcWidth(timeWidth)}px;
    `
    }
    this.unregister = styleUpdateMap.add(id, calcCss)

    return <rect
      data-gantt-id={id}
      {...rectProps} />
  }
}
)

const UsedView = ({ color, dataItem: { highlightPoints, id }, highlightColor, ...rest }) => {
  const { renderHoverComponent, calcWidth, startTime, usedTime, HightLightContainers, ...rectProps } = rest
  return (
    <React.Fragment>
      <UserRect
        parentId={id}
        fill={color}
        {...rectProps}
      />
      {(highlightPoints || []).map((p, i) => {
        return <HightLightPoint
          parentId={id}
          Container={HightLightContainers[p.time]}
          key={p.time} data={p} color={highlightColor}
          {...rest} />;
      })}
    </React.Fragment>
  );
};

export default UsedView;
