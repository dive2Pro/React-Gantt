import React from "react";
import Dragger from "./Dragger";
import DragSvg from "./DragSvg";
import Dragging from "./Dragging";

export default class Slide extends React.PureComponent {
  handleDraggingStateChange = ({ percent, startPercent }) => {
    const { xAxisWidth } = this.props;
    const minPercent = this.MIN_WIDTH / xAxisWidth;
    const changed = {};
    if (percent != null) {
      changed.proption = percent;
    }
    if (startPercent != null) {
      changed.xLeft = startPercent * xAxisWidth;
    }
    this.props.onStateChange(changed);
  };

  render() {
    const {
      xAxisWidth,
      leftWidth,
      minLineHeight,
      data,
      children,
      xLeft,
      proption
    } = this.props;
    let h = minLineHeight * data.length;
    h = h < 30 ? 30 : h;
    const dragSvg = <DragSvg h={h} />;

    return (
      <div className="bottom-slide">
        {children}
        <Dragging
          startPercent={xLeft / xAxisWidth}
          percent={proption}
          onStateChange={this.handleDraggingStateChange}
          width={xAxisWidth}
        >
          {({ percent, startPercent, handleDragging }) => {
            const slideStyle = {
              width: xAxisWidth * percent
            };
            return (
              <div
                className="_slide-container"
                style={{
                  width: xAxisWidth,
                  left: leftWidth,
                  height: h
                }}
              >
                <div
                  style={{
                    minWidth: xLeft
                  }}
                />
                <div className="_slide" style={slideStyle}>
                  <Dragger
                    className="_stretch left"
                    onDragging={diff => handleDragging("left", diff)}
                  >
                    {dragSvg}
                  </Dragger>
                  <Dragger
                    className="_stretch _move"
                    onDragging={diff => handleDragging("", diff)}
                  />
                  <Dragger
                    className="_stretch right"
                    onDragging={diff => handleDragging("right", diff)}
                  >
                    {dragSvg}
                  </Dragger>
                </div>
                <div style={{ flex: 1 }} />
              </div>
            );
          }}
        </Dragging>
      </div>
    );
  }
}
