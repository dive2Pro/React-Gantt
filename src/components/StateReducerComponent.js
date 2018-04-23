import React from "react";

export class StateReducerComponent extends React.Component {
  static defaultProps = {
    stateReducer: (state, change) => change,
    onStateChange: () => {}
  };
  getState = (state = this.state) => {
    return Object.entries(state).reduce((newObj, [key, value]) => {
      if (this.isControlled(key)) {
        newObj[key] = this.props[key];
      } else {
        newObj[key] = value;
      }
      return newObj;
    }, {});
  };

  isControlled = prop => this.props[prop] != undefined;

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
}
