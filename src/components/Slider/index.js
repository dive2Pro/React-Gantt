import React from "react";
import Dragger from "./Dragger";
import DragSvg from "./DragSvg";
import Dragging from "./Dragging";

export default class Slide extends React.PureComponent {
  handleDraggingStateChange = ({ percent, startX }) => {
    const { xAxisWidth } = this.props;
    const changed = {};
    if (percent != null) {
      changed.proption = percent;
    }
    if (startX != null) {
      changed.startX = startX
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
      startX,
      proption,
      min
    } = this.props;
    let h = minLineHeight * data.length;
    h = h < 30 ? 30 : h;
    const dragSvg = <DragSvg h={h} />;

    return (
      <div className="bottom-slide">
        {children}
        <Dragging
          min={min}
          startX={startX}
          percent={proption}
          onStateChange={this.handleDraggingStateChange}
          width={xAxisWidth}
        >
          {({ percent, startPercent, handleDragging }) => {
            const slideStyle = {
              width: xAxisWidth * proption
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
                    minWidth: startX
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
