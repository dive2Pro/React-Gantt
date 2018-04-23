import React from "react";
const noop = () => {};
export default class Dragger extends React.PureComponent {
  static defaultProps = {
    dragEnd: noop,
    dragStateChange: noop,
    onDragging: noop
  };

  mouseDown = e => {
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    this.beganning = true;
    this.startX = e.clientX;
    const { dragStateChange } = this.props;
    dragStateChange(true);
    document.addEventListener("mousemove", this.mouseMove, false);
    document.addEventListener("mouseup", this.mouseUp, false);
  };

  mouseMove = e => {
    if (!this.beganning || this.startX === null) {
      return;
    }
    const { onDragging } = this.props;
    const diff = e.clientX - this.startX;
    // console.log(diff,)
    onDragging(diff, this.startX);
    this.startX = e.clientX;
  };

  mouseUp = e => {
    if (!this.beganning) {
      return;
    }
    document.body.style.cursor = "auto";
    document.body.style.userSelect = "initial";
    this.startX = null;
    const { dragEnd, dragStateChange } = this.props;
    dragStateChange(false);
    dragEnd();
    document.removeEventListener("mousemove", this.mouseMove, false);
    document.removeEventListener("mouseup", this.mouseUp, false);
  };
  render() {
    return <div {...this.props} onMouseDown={this.mouseDown} />;
  }
}
