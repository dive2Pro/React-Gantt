import React from "react";
import HelpRects from "./HelpRects";
import Nodes from "./Nodes";

export default class XAxisSvg extends React.PureComponent {
  render() {
    const { leftWidth, lineHeight, readOnly } = this.props;
    return (
      <svg x={leftWidth} id={`gantt-xaxis${readOnly ? '-readOnly' : ''}`}>
        <HelpRects/>
        <defs>{React.createElement(Nodes, { readOnly: true })}</defs>
        {React.createElement(Nodes)}
      </svg>
    );
  }
}

/**
 
 */