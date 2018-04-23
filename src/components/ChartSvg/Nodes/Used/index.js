import React from "react";
import HightLightPoint from "./HightLightPoint";
const UsedView = ({ color, highlightPoints = [], ...rest }) => {
  return (
    <React.Fragment>
      <rect fill={color} {...rest} />
      {highlightPoints.map((p, i) => {
        return <HightLightPoint key={p.time} data={p} {...rest} />;
      })}
    </React.Fragment>
  );
};

export default UsedView;
