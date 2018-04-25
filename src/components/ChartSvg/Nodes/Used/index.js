import React from "react";
import HightLightPoint from "./HightLightPoint";
import { stateConsumerProps } from '../../../constants'

const UserRect = stateConsumerProps(function UserRect({ timeWidth, timeStartPoint,
  calcWidth, proption, transform, ...rectProps }) {
  return <rect {...rectProps} x={calcWidth(timeStartPoint, proption)} width={calcWidth(timeWidth, proption)} />
}
)

const UsedView = ({ color, dataItem: { highlightPoints }, highlightColor, ...rest }) => {
  const { renderHoverComponent, calcWidth, startTime, usedTime, HightLightContainers, ...rectProps } = rest
  return (
    <React.Fragment>
      <UserRect
        fill={color} {...rectProps}
      />
      {(highlightPoints || []).map((p, i) => {
        return <HightLightPoint
          Container={HightLightContainers[p.time]}
          key={p.time} data={p} color={highlightColor}
          {...rest} />;
      })}
    </React.Fragment>
  );
};

export default UsedView;
