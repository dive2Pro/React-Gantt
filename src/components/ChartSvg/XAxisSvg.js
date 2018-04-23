import React from "react";
import HelpRects from "./HelpRects";
import Nodes from "./Nodes";

export default class XAxisSvg extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { yAxisWidth } = this.props;
    return (
      <svg x={yAxisWidth}>
        <HelpRects />
        <defs>{React.createElement(Nodes, { readOnly: true })}</defs>
        {React.createElement(Nodes)}
      </svg>
    );
  }
}
