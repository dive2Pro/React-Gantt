import moment from "moment";
import React from "react";

export { moment };
export const dayMillisedons = 1000 * 3600 * 24;

export const GanttContext = React.createContext({});
export const GanttStateContext = React.createContext({});
export const columns = 48;

export const Types = {
  AWAIT: "__AWAIT",
  TASK: "__TASK",
  HIGHLIGHT: "__HIGHT_LIGHT"
};

export const DEFAULT_EMPTYELEMENT = (props = {}) => (
  <React.Fragment>{props.children}</React.Fragment>
);
