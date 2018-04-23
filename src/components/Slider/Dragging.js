import React from "react";
import { StateReducerComponent } from "../StateReducerComponent";

export default class Dragging extends StateReducerComponent {
  static defaultProps = StateReducerComponent.defaultProps;
  state = {
    startPercent: this.props.startPercent || 0,
    percent: this.props.percent || 0.4
  };

  // 左边Drag
  setStartPercentAndPercent = diff => {
    const { width } = this.props;
    const { startPercent, percent } = this.getState();
    const totalPercent = startPercent + percent;
    const totalWidth = totalPercent * width;

    let leftWidth = startPercent * width;
    if (leftWidth <= 0 && diff < 0) {
      return;
      
    }
    leftWidth = leftWidth + diff;
    if (leftWidth < 0) {
      leftWidth = 0;
    } else if (leftWidth >= totalWidth) {
      leftWidth = totalWidth;
    }

    const currentPercentWidth = totalWidth - leftWidth;

    this.internalSetState({
      percent: (currentPercentWidth / width).toFixed(6) * 1,
      startPercent: (leftWidth / width).toFixed(6) * 1
    });
  };

  // 右边Drag
  setPercent = diff => {
    const { width } = this.props;
    const { startPercent, percent } = this.getState();
    const percentWidth = percent * width;
    const leftWidth = +startPercent * width;
    let deltaWidth = percentWidth + diff;
    if (deltaWidth < 0) {
      deltaWidth = 0;
    }
    if (deltaWidth + leftWidth >= width) {
      deltaWidth = width - leftWidth;
    }
    const currentPercent = deltaWidth / width;

    this.internalSetState({
      percent: parseFloat(currentPercent.toFixed(6))
    });
  };

  // move
  setStartPercent = diff => {
    const { width } = this.props;
    const { startPercent, percent } = this.getState();
    const leftWidth = startPercent * width;
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
      startPercent: parseFloat(currentStartPercent.toFixed(6))
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
