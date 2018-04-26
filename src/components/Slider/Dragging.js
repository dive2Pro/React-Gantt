import React from "react";
import { StateReducerComponent } from "../StateReducerComponent";

export default class Dragging extends StateReducerComponent {
  static defaultProps = StateReducerComponent.defaultProps;
  state = {
    startX: this.props.startX,
    percent: this.props.percent
  };

  // 左边Drag
  setStartPercentAndPercent = diff => {
    const { width, min } = this.props;
    const { startX, percent } = this.getState();
    const percentWidth = +percent * width
    const totalWidth = percentWidth + startX;
    if (startX <= 0 && diff < 0) {
      return;
    }
    let delta = startX + diff;
    if (startX < 0) {
      delta = 0;
    } else if (delta >= totalWidth) {
      delta = totalWidth;
    } 
    if (min * width > totalWidth - delta) {
      // delta = startX
      return 
    }
    const currentPercentWidth = totalWidth - delta;

    this.internalSetState({
      percent: (currentPercentWidth / width).toFixed(6) * 1,
      startX: delta
    });
  };

  // 右边Drag
  setPercent = diff => {
    const { width } = this.props;
    const { startX, percent } = this.getState();
    const percentWidth = percent * width;
    const leftWidth = startX;
    let deltaWidth = percentWidth + diff;
    if (deltaWidth < 0) {
      deltaWidth = 0;
    }
    if (deltaWidth + leftWidth >= width) {
      deltaWidth = width - leftWidth;
    }
    const currentPercent = deltaWidth / width;

    this.internalSetState({
      percent: currentPercent.toFixed(6)* 1
    });
  };

  // move
  setStartPercent = diff => {
    const { width } = this.props;
    const { startX, percent } = this.getState();
    const leftWidth = startX;
    let deltaWidth = leftWidth + diff;
    if (deltaWidth < 0) {
      deltaWidth = 0;
    }

    const percentWidth = percent * width;
    if (percentWidth + deltaWidth >= width) {
      deltaWidth = width - percentWidth;
    }

    const currentStartPercent = deltaWidth / width;

    this.internalSetState({
      startX: deltaWidth
    });
  };
  handleDragging = (direction, ...args) => {
    switch (direction) {
      case "left":
        return this.setStartPercentAndPercent.apply(null, args);
      case "right":
        return this.setPercent.apply(null, args);
      default:
        this.setStartPercent.apply(null, args);
    }
  };

  render() {
    const children = this.props.children;
    const props = {
      ...this.getState(),
      handleDragging: this.handleDragging
    };
    return typeof children === "function"
      ? children(props)
      : React.cloneElement(React.Children.only(children), props);
  }
}
