
# 如何画一个 gantt 图

1. 什么是 gantt 图 ?

甘特图（Gantt chart）又称为横道图、条状图(Bar chart)。其通过条状图来显示项目，进度，和其他时间相关的系统进展的内在关系随着时间进展的情况。以提出者亨利·L·甘特（Henrry L. Ganntt）先生的名字命名(https://baike.baidu.com/item/%E7%94%98%E7%89%B9%E5%9B%BE)

2. 目的
    绘制一副反应每日任务(24HR)
3. 组成

                  Title
    
        任务名 
          Y         图表    X 轴
          轴     
                概要图 | 漫游器

4. 哪些功能?
    1. 图表绘制
    2. 漫游器 控制左右和 缩放比例
    3. 节点事件 (hover  | click)
    4. 标识节点中特殊事件 
5. 如何实现

    1. Title
        正常的 DOM 节点,固定的高度
    2. Y 轴
        展现任务名
        1. 特殊点:
            1. 固定位置, 不会随图表的左右滑动而改变自己的位置
                和 X 轴属于同一个 SVG , <YAxis />
            2. 宽度对结构的影响不会很大, 但高度:
                - 文字始终在中间位置 (计算得出),
                - ~~~右边的图表的高度可能会变化, 但Y轴上的高度是最高一层的高度~~~
                - 在绘制时, 每一层的高度都已经固定了. 这是因为图表的每一行都是有 `deltaY` 来确定的
        2.  如何绘制:
            传入的 props: {
                names: []string,
                h: number // 一行的高度
                width: number //宽度
            }
            所以, 绘制的宽度和高度都是在绘制之前就已经确定,若某个 name 太长, 会延伸到 XAxis 中.
            ```javascript
            const names = ["任务1", "任务2", "任务3"];
            const h = 35;
            const startX = 3,startY = 3;
                const YAxis = ({ names, h, width }) => {
                return (
                    <g id="yaxis">
                    {names.map((name, i) => {
                        return (
                        <React.Fragment key={name}>
                            <rect x={startX} y={startY + h * i} width={width} height={h} />
                            <text x={23} y={25 + h * i}>
                            {name}
                            </text>
                        </React.Fragment>
                        );
                    })}
                    </g>
                );
                };
            ```
    3. X 轴 (时间轴)
        > TODO: 发散思维, 提取共同点
        1.  时间轴,  将 24 小时展现为 48列 小rect & 任务数列
            <rect x="" y="" width={rectWidth} height={rectHeight} />
        2.  ~~~每半个小时区间内~~~ 任务起止点精确到秒    
            >   画布整体是 某一天的 [00:00 - 24:00], 宽是固定的(700), 可以通过计算得出 `rect`的 x 和 y, 不同的是缩放比例
            1.  绘制辅助线
            3.  绘制预期时间段 averageValue
            4.  绘制实际花费时间段 { startTime, endTime}
            5.  绘制特殊事件 // []highlightPoints
            6.  绘制等待时间段 // 与前一个任务相距的时间段
            7.  绘制name
        3.  缩放 & 漫游
            - 效果: 起始比例是 1 , 展现完整的宽度 [0, 700]
                - 漫游到某一点, 例如 [200, 700], 那么
                    1.  x 轴的变化:
                        -   辅助线  [0, 200] transition( { 200 - 当前 x 位置  } , 0)
                        -   辅助线  [200, 700] transition ( { 200 - 当前 x 位置 } , 0)  
                    2.  w 的变化:
                        -   除了name 外, 其他各个 rect 都是需要改变自己的 width
                        -   这个计算的模式应该是相同的 [ 给定的 startTime, averageValue 等条件 ], 提取到一个 HOC 中
                        -   原本是 1 的比例, 现在要变成 500 / 700 : k / 1
                -   测试可行性 : 
                    1. 使用 symbol 调整 viewport 的方式
                        1.  symbol 包裹 一些 svg 图形, 定义 viewBox `[x , y, w , h]`, 设置每个模板的可见部分应该是什么. 预想是改变 width 的值
                        2.  但不可行的一点是, symbol 中图形在 会根据use 中的`width | height`来 **缩放** 整个图形从而确保内部的图形是置中的,显而易见的是这些改变会影响图形的高度
                        3.  如果要调整比例, 那么 use 和 symbol的值都需要改变, 所以这个方案是**不可行**的. 
                    2.  根据比例调整, 直接按比例调整 每个元素的 width 的值
                        已测试 , 调整比例和 xLeft都可行. 代码可检查 `tests.js`
        4.  响应事件
            > Svg 是dom 元素, 相比较 canvas , 在事件处理上有优势. (https://www.w3.org/TR/SVG11/interact.html)
            
            1.  hover 事件 , onMouseEnter, onMouseLeave
            2.  click 事件 , onClick
    4.  漫游器
        > 是一个渲染了微小化的 X轴上元素的, 左右 extend 和 drag两个功能 的 Component
        同一个 svg 下, 确保位置计算时
        1.  渲染和 [3] 一样, 但是initial一次, 后期的 state change 不影响
        2.  通过 react-dnd 添加 extend 和 drag 功能
        3.  对外接受一个 onChange 回调 prop
        4.  测试:
            使用 `symbol` 包裹 [3] 的组件, 可以使用该方式渲染一个微小化的 x轴,
            ```javascript
              const HalfHour = props => {
                return (
                  <React.Fragment>
                    <defs>
                      <symbol id="render" viewBox="0 0 750 550">
                        <ChangeRect {...props} />
                        <ChangeRect {...props} index={2} />
                        <Dot {...props} />
                      </symbol>
                    </defs>
                    <use href="#render" x="0" y="00" width="750" height="550" />
                  </React.Fragment>
                );
              };
            ```
             遇到的问题是 当在其他位置 `use` 这个 symbol 的时候, 它的改变是同步的. 而这是我不想要的
             TODO: 找到一个方式可以阻止其更新状态