import moment from "moment";
import React from "react";

export { moment };
export const dayMillisedons = 1000 * 3600 * 24;

export const GanttStateContext = React.createContext({});
export const GanttValueStaticContext = React.createContext({});

export const stateConsumerProps = (Component) => {

  const Wrapper = ({ innerRef, readOnly, ...props }) => {
    const Consumer = readOnly ? GanttValueStaticContext.Consumer : GanttStateContext.Consumer;

    return <Consumer>
      {
        (state) => {
          return <Component ref={innerRef} {...props} {...state
          }
            proption={readOnly ? 1 : state.proption}
            readOnly={readOnly} />
        }
      }
    </Consumer>
  }
  Wrapper.displayName = `StateConsumer:( ${Component.displayName || Component.name || Component} )`
  return Wrapper
}

export const valueStaticProps = Component => {
  const Wrapper = ({ innerRef, ...props }) => {
    const Consumer = GanttValueStaticContext.Consumer
    return <Consumer>
      {
        (value) => {
          const { proption, ...state } = value
          return <Component ref={innerRef} {...props} {...state}
            proption={props.readOnly  ? 1 : proption}

          />
        }
      }
    </Consumer>
  }

  Wrapper.displayName = `StateConsumer:( ${Component.displayName || Component.name || Component} )`

  return Wrapper
}

export const specifyPropsWithStateConsumer = props => {
  return stateConsumerProps(class SpecifyPropsWithStateConsumer extends React.Component {
    shouldComponentUpdate(nextProps) {
      return props.some( p => {
        return this.props[p] != nextProps[p]
      })
    }
    render() {
      return this.props.children(this.props)
    }
  })
}

export const columns = 48;

export const Types = {
  AWAIT: "__AWAIT",
  TASK: "__TASK",
  HIGHLIGHT: "__HIGHT_LIGHT"
};

export const DEFAULT_EMPTYELEMENT = (props = {}) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const DEFUALT_RENDER_HOVER_COMPONENT = () => DEFAULT_EMPTYELEMENT
export const HalfHours = [
  "00:00", "00:30",
  "01:00", "01:30",

  "02:00", "02:30",
  "03:00", "03:30",

  "04:00", "04:30",
  "05:00", "05:30",

  "06:00", "06:30",
  "07:00", "07:30",

  "08:00", "08:30",
  "09:00", "09:30",

  "10:00", "10:30",
  "11:00", "11:30",

  "12:00", "12:30",
  "13:00", "13:30",

  "14:00", "14:30",
  "15:00", "15:30",

  "16:00", "16:30",
  "17:00", "17:30",

  "18:00", "18:30",
  "19:00", "19:30",

  "20:00", "20:30",
  "21:00", "21:30",

  "22:00", "22:30",
  "23:00", "23:30",
  "24:00"
]


export const lineProps = {
  fill: 'transparent',
  stroke: "blue",
  strokeWidth: 0.2,
  strokeOpacity: 0.5,
  strokeDasharray: [5, 3],
  strokeDashoffset: 2
};

const prefix = '_react_gantt'
export const HelpRectRowId = `${prefix}help-rect-row-id`
export const HelpRectColumnPrefix = `${prefix}help-rect-column`

export const NodesGId = `${prefix}-nodes-g-id-`
export const RowRectId = `${prefix}-row-rect`