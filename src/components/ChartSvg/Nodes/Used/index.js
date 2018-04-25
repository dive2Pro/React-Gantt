import React from "react";
import HightLightPoint from "./HightLightPoint";
const UsedView = ({ color, dataItem: { highlightPoints }, highlightColor, ...rest }) => {
  const {renderHoverComponent, calcWidth, startTime,usedTime, ...rectProps } = rest
  return (
    <React.Fragment>
      <rect fill={color} {...rectProps} />
      {(highlightPoints || [] ).map((p, i) => {
        return <HightLightPoint key={p.time} data={p} color={highlightColor} 
        {...rest} />;
      })}
    </React.Fragment>
  );
};

export default UsedView;
