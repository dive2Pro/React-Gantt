import React from "react";
import { render } from "react-dom";
import Gantt from "./Gantt";
import { Popover } from "antd";
import "antd/dist/antd.css";
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
      startTime: "2018-4-21, 0:0", // 微秒
      endTime: "2018-4-21, 6: 22" // 微秒
    },
    YAxis: "上路", // 任务名
    highlightPoints: [
      {
        time: DATE + "5:30", // 微秒
        content: "-=-=-=-="
      }
    ],
    avarageValue: 3600000 // 微秒, 该任务平均花费的时间,
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
          e.persist();
          console.log("hello");
        },
        getHighLightProps(data) {
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
      endTime: "2018-4-21, 17: 10" // 微秒
    },
    YAxis: "中路挂机者", // 任务名
    highlightPoints: [
      {
        time: DATE + "17:00",
        content: "A帐" // 微秒
      }
    ],
    avarageValue: 7200000 // 微秒, 该任务平均花费的时间,
  }
];

class App extends React.PureComponent {
  render() {
    return (
      <Gantt
        data={DATA.concat(
          DATA.concat(DATA)
            .concat(DATA)
            .concat(DATA)
            .concat(DATA)
        )}
        chartHeight={700}
        proption={0.4}
        startX={200}
        date={"2018-4-21"}
        renderHoverComponent={(type, dataItem, ...rest) => {
          switch (type) {
            case Gantt.Types.HIGHLIGHT:
              return (
                <Popover
                  content={<div>{dataItem.content}</div>}
                  title="Title"
                  trigger="click"
                />
              );
            case Gantt.Types.TASK:
              return (
                <Popover
                  content={<div>{dataItem.name}</div>}
                  title="Title"
                  trigger="hover"
                />
              );
            default:
          }
        }}
      />
    );
  }
}

render(<App />, document.getElementById("root"));
