import React from "react";
import throttle from "lodash/throttle";

export default class Slide extends React.PureComponent {
  static defaultProps = {
    stateReducer: (state, change) => change,
    onStateChange: () => {}
  };
  MIN_WIDTH = 26;

  getDragPosition = ({ proption, xLeft, xAxisWidth, yAxisWidth }) => {
    let width = xAxisWidth + yAxisWidth;
    // const { proption, xLeft } = this.getState();
    width = parseFloat(proption) * xAxisWidth;
    let rightX = xAxisWidth - xLeft - width;

    return {
      leftX: xLeft,
      rightX,
      width
    };
  };

  isControlled = prop => this.props[prop] != undefined;

  /**
   * 检查 state, 如果 props 中有该 field, 使用 props 的值
   * @param (object ) state
   * @return merged with props
   */
  getState = (state = this.state) => {
    return Object.entries(state).reduce((newObj, [key, value]) => {
      if (this.isControlled(key)) {
        newObj[key] = this.props[key];
      } else {
        newObj[key] = value;
      }
      if (key == "MIN_WIDTH") {
        newObj[key] = newObj[key] || 0 + this.MIN_WIDTH;
      }
      return newObj;
    }, {});
  };

  state = {
    proption: this.props.proption,
    xLeft: this.props.xLeft,
    MIN_WIDTH: this.props.MIN_WIDTH
      ? this.props.MIN_WIDTH + this.MIN_WIDTH
      : this.MIN_WIDTH,
    ...this.getDragPosition(this.props)
  };

  internalSetState = (update, callback) => {
    let allChanges;
    this.setState(
      state => {
        const combined = this.getState(state);
        const changes =
          typeof update === "function" ? update(combined) : update;

        // 外部回调的 state
        allChanges = this.props.stateReducer(combined, changes) || {};
        // 过滤 type,
        const { type, ...onlyChanges } = allChanges;

        // 需要过滤掉 props 的 field
        const nonControlledChanges = Object.keys(onlyChanges).reduce(
          (newObject, key) => {
            if (!this.isControlled(key)) {
              if (onlyChanges.hasOwnProperty(key)) {
                newObject[key] = onlyChanges[key];
              } else {
                newObject[key] = combined[key];
              }
            }

            return newObject;
          },
          {}
        );
        // console.log(nonControlledChanges, ' -=-=-=', onlyChanges, ' === ', combined, changes)

        return Object.keys(nonControlledChanges || {}).length
          ? nonControlledChanges
          : null;
      },
      () => {
        this.props.onStateChange(allChanges);
        callback && callback();
      }
    );
  };

  handleInputProptionChange = ({ target: { value } }) => {
    // value is float
    this.internalSetState({
      proption: value
    });
  };

  handleInputXChange = ({ target: { value } }) => {
    this.internalSetState({
      xLeft: value * -1
    });
  };

  handleRef = n => {
    this.container = n;
  };

  handleXLeftChange = offset => {
    const { xAxisWidth } = this.props;
    const { leftX, rightX, width, MIN_WIDTH } = this.getState();
    let deltaWidth = leftX + offset;
    if (deltaWidth <= 0) {
      deltaWidth = 0;
    }
    let currentWidth = xAxisWidth - rightX - deltaWidth;
    if (currentWidth < MIN_WIDTH) {
      currentWidth = MIN_WIDTH;
      deltaWidth = xAxisWidth - rightX - MIN_WIDTH;
    }
    const currentProption = currentWidth / xAxisWidth;
    this.internalSetState({
      xLeft: deltaWidth,
      width: currentWidth,
      proption: currentProption,
      leftX: deltaWidth
    });
  };

  handleXRightChange = offset => {
    const { xAxisWidth } = this.props;
    const { rightX, leftX, width, MIN_WIDTH } = this.getState();

    let deltaWidth = rightX - offset;
    if (deltaWidth < 0) {
      deltaWidth = 0;
    }
    let currentWidth = xAxisWidth - deltaWidth - leftX;
    if (currentWidth < MIN_WIDTH) {
      currentWidth = MIN_WIDTH;
      deltaWidth = xAxisWidth - leftX - MIN_WIDTH;
    }
    const currentProption = currentWidth / xAxisWidth;

    // console.log(currentWidth, ' -- ')
    this.internalSetState({
      proption: currentProption,
      width: currentWidth,
      rightX: deltaWidth
    });
  };

  handleSlideMove = offset => {
    const { width, leftX, rightX } = this.getState();
    const { xAxisWidth } = this.props;
    let currentLeftX = leftX + offset;
    if (currentLeftX < 0) {
      currentLeftX = 0;
      offset = 0;
    }
    if (rightX == 0 && offset > 0) {
      currentLeftX = xAxisWidth - width;
    }

    let currentRightX = xAxisWidth - currentLeftX - width;
    if (currentRightX <= 0) {
      currentRightX = 0;
    }
    // console.log(currentLeftX, currentRightX, width, xAxisWidth);

    this.internalSetState({
      xLeft: currentLeftX,
      leftX: currentLeftX,
      rightX: currentRightX
    });
  };

  render() {
    const {
      xAxisWidth,
      yAxisWidth,
      minLineHeight,
      data,
      children
    } = this.props;
    let h = minLineHeight * data.length;
    h = h < 30 ? 30 : h;

    const { leftX, width, rightX } = this.state;
    const slideStyle = {
      marginLeft: leftX,
      marginRight: rightX
    };

    return (
      <div ref={this.handleRef} className="bottom-slide">
        {children}
        <div
          className="_slide-container"
          style={{
            width: xAxisWidth,
            left: yAxisWidth,
            height: h
          }}
        >
          <div className="_slide" style={slideStyle}>
            <StretchPart
              h={h}
              direction="left"
              onChange={this.handleXLeftChange}
            />
            <StretchPart
              h={h}
              direction="_move"
              className="_move"
              style={{ height: "100%" }}
              onChange={this.handleSlideMove}
            />
            <StretchPart
              h={h}
              direction="right"
              onChange={this.handleXRightChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
const tempD = document.createElement("div");

export class StretchPart extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleDraging = throttle(this.handleDraging, 100, true);
  }

  componentDidMount() {
    // this.props.connectDragPreview(getDragPreview())
  }

  _handleDraging = e => {
    e.persist();
    this.handleDraging(e);
  };
  handleDraging = e => {
    e.persist();
    const pageX = e.pageX;
    if (this.startX && pageX) {
      const diff = pageX - this.startX;
      if (diff === 0) {
        return;
      }
      this.startX = pageX;
      this.props.onChange(diff);
    }
  };

  handleDragEnd = e => {
    e.persist()
    this.startX = null;
    document.body.removeChild(tempD);
  };
  handleDragStart = e => {
    tempD.style.backgroundColor = "red";
    document.body.appendChild(tempD);
    e.dataTransfer.setDragImage(tempD, 0, 0);
    this.startX = e.pageX;
  };

  render() {
    const { direction, connectDragSource, isDragging, h } = this.props;
    if (direction == void 0) {
      throw new Error(`must set field: direction`);
    }

    const rectWidth = 14,
      rectHeight = h - 10,
      height = h,
      xDelta = 3,
      yDelta = 4,
      startY = 2;
    const rectY = (height - rectHeight) / 2;
    const showSvg = direction == "right" || direction == "left";
    const svg = showSvg ? (
      <svg>
        <g stroke="#b2bbb2cc" fill="#b2bbb2cc">
          <line
            x1={rectWidth / 2}
            x2={rectWidth / 2}
            y1={startY}
            y2={height - startY}
          />
          <rect
            rx="2"
            ry="2"
            x={0}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
          />
          <line
            x1={rectWidth / 2 - xDelta}
            x2={rectWidth / 2 - xDelta}
            y1={rectY + yDelta}
            y2={rectY + rectHeight - yDelta}
            stroke="white"
          />
          <line
            x1={rectWidth / 2 + xDelta}
            x2={rectWidth / 2 + xDelta}
            y1={rectY + yDelta}
            y2={rectY + rectHeight - yDelta}
            stroke="white"
          />
        </g>
      </svg>
    ) : null;
    return (
      <div
        draggable={true}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDrag={this._handleDraging}
        style={{
          opacity: isDragging ? 0.5 : 1
        }}
        className={`_stretch ${direction}`}
      >
        {svg}
      </div>
    );
  }
}
