import React from "react";
import { ChangeRect, HalfHour, ID_READONLY } from "./test";

import "./style.css";
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const MenuSvg = () => (
  <symbol id="m" viewBox="0 0 150 150">
    <line x1="3" y1="3" x2="48" y2="3" />
    <line x1="3" y1="19" x2="68" y2="19" />
    <line x1="3" y1="35" x2="48" y2="35" />
    <line x1="3" y1="51" x2="58" y2="51" />
  </symbol>
);
const InsertSvg = () => (
  <g id="i">
    <polyline points="3 3, 30 28, 3 53" />
  </g>
);

const BrowserSvg = () => (
  <g id="bs">
    <rect x="3" y="3" width="80" height="60" />
    <line x1="3" y1="19" x2="80" y2="19" />
    <line x1="20" y1="3" x2="20" y2="16" />
  </g>
);
const Warning = () => (
  <g id="wn">
    <ellipse cx="60" cy="60" rx="55" ry="55" />
    <line x1="60" y1="20" y2="70" x2="60" />
    <ellipse style={{ fill: "black" }} cx="60" cy="93" rx="5" ry="5" />
  </g>
);
const Download = () => (
  <g id="dl">
    <path d="M 18 3, L 46 3, L 46 40, L 61 40, L 32 68, L 3 40, L 18 40, Z" />
  </g>
);
const names = ["任务1", "任务2", "任务3"];
const h = 35;
const startX = 3,
  startY = 3;
const YAxis = ({ names, h }) => {
  const length = names.length;
  return (
    <symbol id="yaxis" viewBox={`0 0 ${80} ${length * h + 3}`}>
      {names.map((name, i) => {
        return (
          <React.Fragment key={name}>
            <rect x={startX} y={startY + h * i} width="80" height={h} />
            <text x={23} y={25 + h * i}>
              {name}
            </text>
          </React.Fragment>
        );
      })}
    </symbol>
  );
};

class Test extends React.PureComponent {
  state = {
    proption: 1,
    xLeft: 0
  };
  handleInputProptionChange = ({ target: { value } }) => {
    // value is float
    this.setState({
      proption: value
    });
  };
  handleInputXChange = ({ target: { value } }) => {
    this.setState({
      xLeft: value * -1
    });
  };
  render() {
    return (
      <div style={styles}>
        Proption:
        <input
          type="range"
          max="1"
          min="0.01"
          step="0.01"
          defaultValue="1"
          onChange={this.handleInputProptionChange}
        />
        X:
        <input
          type="range"
          max="200"
          min="0"
          defaultValue="0"
          onChange={this.handleInputXChange}
        />
        <div className="grid">
          <svg style={{ background: "light" }} width="750" height="500">
            <defs>
              <BrowserSvg />
              <MenuSvg />
              <InsertSvg />
              <Warning />
              <Download />
              <YAxis names={names} h={h} />
            </defs>
            {/*     <use xlinkHref="#m" x="200" y="200" width="100" height="100" />
          <use xlinkHref="#bs" x="200" y="100" />
          <use xlinkHref="#i" x="300" y="100" />
          <use xlinkHref="#wn" x="400" y="100" />
          <use xlinkHref="#dl" x="500" y="100" />
            <symbol id="alert" viewBox="0 0 86 86">
              <ellipse cx="43" cy="43" rx="40" ry="40" />
              <ellipse
                style={{ fill: "black" }}
                cx="43"
                cy="65"
                rx="5"
                ry="5"
              />
              <line
                style={{ "stroke-width": 8 }}
                x1="43"
                y1="19"
                x2="43"
                y2="48"
              />
              <ChangeRect {...this.state} />
            </symbol>
            <use href="#alert" x="100" y="200" width="80" height="100" />
            <use href="#alert" x="00" y="400" width="750" height="100" />
            */}
            <HalfHour {...this.state} />
          </svg>
        </div>
        <svg width="1400" height={400} style={{ background: "white" }}>
          <use
            href={`#${ID_READONLY}`}
            x="-400"
            y="0"
            width="1400"
            height="500"
          />
        </svg>
      </div>
    );
  }
}
