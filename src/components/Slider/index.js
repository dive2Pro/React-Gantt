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
  renderDragger = (name, handleDragging) => {
    const h = this.getHeight()
    const dragSvg = name === '_move' ? null : <DragSvg h={h} />;
    return <Dragger
      className={`_stretch ${name}`}
      onDragging={diff => handleDragging(name, diff)}
      dragStateChange={this.props.dragStateChange}
    >
     {
       dragSvg
     }
    </Dragger>
  }
  getHeight = () => {
    const {
      minLineHeight,
      data,
      h,
     } = this.props
    // let h = minLineHeight * data.length;
    // h = h < 30 ? 30 : h;
    return h;
  }
  render() {
    const {
      width,
      leftWidth,
      children,
      startX,
      proption,
      min,
      minLineHeight,
      h
    } = this.props;
    return (
      <div className="bottom-slide">
        {children}
        <Dragging
          min={min}
          startX={startX}
          percent={proption}
          dragEnd
          onStateChange={this.handleDraggingStateChange}
          width={width}
        >
          {({ percent, startPercent, handleDragging }) => {
            const slideStyle = {
              width: width * proption
            };
            return (
              <div
                className="_slide-container"
                style={{
                  width: width,
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
                  {
                    this.renderDragger('left', handleDragging)
                  }
                  {
                    this.renderDragger('_move', handleDragging)
                  }
                  {
                    this.renderDragger('right', handleDragging)
                  }
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
