import React from "react";
import { render } from "react-dom";
import Gantt from "./Gantt";

/**
 * 编码阶段:
 *
 */

const DATE = "2018-4-21, ";
const DATA = [
  {
    id: 1, // ...
    name: "哈斯卡", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 03:55", // 微秒
      endTime: "2018-4-21, 6: 22" // 微秒
    },
    YAxis: "上路", // 任务名
    highlightPoints: [
      {
        time: DATE + "5:30" // 微秒
        // ...specificProps // 可以传递任意的值, 这些都会 patch 到 绘制的 `ellipse` 上面
      }
    ],
    avarageValue: 3600000 // 微秒, 该任务平均花费的时间,
    // hoverComponent: (type: 组件的类型(Await | USED | AVARAGE)) => React.ReactComponent // 可以被 React.cloneElement 所覆盖 , default = (props) => <React.Fragment {...props} />,
    // avarageColor?: string,
    // waitingColor?: string
    // usedColor?: string
    // lineHeight?: number = 50,
    // yAxisWidth?: number = 100,
    // xAxisWidth?: number = 750,
    // xAxisHeight?: number = 1000
    // ...restProps // 可以传递任意的值, 这些都会 patch 到 每个单元 `g` 上面
  },
  {
    id: 2, // ...
    name: "斧王", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 10:15", // 微秒
      endTime: "2018-4-21, 12: 22" // 微秒
    },
    YAxis: "打野", // 任务名
    highlightPoints: [
      {
        time: DATE + "10:30", // 微秒
        onClick: e => {
          console.log(e);
        },
        getHighLightProps(data) {
          console.log(data);
          return {
            style: { cursor: "pointer" }
          };
        }
      }
    ],
    avarageValue: 7100000 // 微秒, 该任务平均花费的时间,
  },

  {
    id: 3, // ...
    name: "敌法师", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 03:15", // 微秒
      endTime: "2018-4-21, 12: 22" // 微秒
    },
    YAxis: "FARM", // 任务名
    highlightPoints: [
      {
        time: DATE + "8:30",
        content: "狂战斧" // 微秒
      }
    ],
    avarageValue: 7200000 // 微秒, 该任务平均花费的时间,
  },

  {
    id: 4, // ...
    name: "祈求者", // 展示名, 展示在最高层
    usedTime: {
      startTime: "2018-4-21, 15:20", // 微秒
      endTime: "2018-4-21, 18: 22" // 微秒
    },
    YAxis: "中路挂机者", // 任务名
    highlightPoints: [
      {
        time: DATE + "17:30",
        content: "A帐" // 微秒
      }
    ],
    avarageValue: 7200000 // 微秒, 该任务平均花费的时间,
  }
];

class App extends React.PureComponent {
  render() {
    return <Gantt data={DATA} date={"2018-4-21"} />;
  }
}

render(<App />, document.getElementById("root"));
