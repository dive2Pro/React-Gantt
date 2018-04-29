import React from "react";
import HightLightPoint from "./HightLightPoint";
import { valueStaticProps } from '../../../constants'

const UserRect = valueStaticProps(function UserRect({ timeWidth, timeStartPoint,
  styleUpdateMap, parentId, x, width, readOnly, ...rectProps }) {
  const id =  parentId + '-userrect-' + timeStartPoint
  function calcCss({proption, calcWidth}) {
    return `
      x: ${calcWidth(timeStartPoint, proption)};
      width: ${calcWidth(timeWidth, proption)}px;
    `
  }
  styleUpdateMap.add(id, calcCss)
  
  return <rect
    data-gantt-id={readOnly || id}
    {...rectProps} />
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
