import {
    NodesGId,
    HelpRectRowId,
    dayMillisedons,
    RowRectId,
    HelpRectColumnPrefix,
    columns
} from "./components/constants";
import fastdom from 'fastdom'
import { throttle } from 'lodash'
function generateId(id) {
    return `#gantt-xaxis  [data-gantt-id="${id}"]`
}

function generateOnceId(id) {
    return `#${NodesGId}readOnly [data-gantt-id="${id}"]`
}

function NodesTransform({ transform }) {
    return `
        transform:${transform};
    `
}

const columnIds = new Array(columns).fill(0).map((_, i) => generateId(HelpRectColumnPrefix + '-' + i))
function ColumnWidth({ helpRectWidth }) {
    let id
    const style = []
    for (let index = 0; index < columnIds.length; index++) {
        style.push(
            `${columnIds[index]} {
               x: ${helpRectWidth * index}px;
            }`
        )
    }
    return style.join(" ");
}
class StyleMap {
    addToOnce = false
    args
    constructor(args) {
        this.selector = new Map()
        this.arraySelector = new Array()
        const el = document.createElement('style');
        el.type = 'text/css';
        this.el = el;
        document.head.appendChild(el)
        // this.update = throttle(this.update, 16, true);
        this.onceSelector = new Map();
        const onceEl = document.createElement('style')
        onceEl.type = 'text/css'
        this.onceEl = onceEl
        document.head.appendChild(this.onceEl)
        this.args = args
    }

    setEl(el) {
        this.el = el;
    }
    toggleOnce() {
        this.addToOnce = !this.addToOnce
    }
    add(id, updater) {
        if (this.addToOnce) {
            this.onceSelector.set(generateOnceId(id), [updater, id])
            return () => {
                this.onceSelector.delete(generateOnceId(id))
            }
        } else {
            const newId = generateId(id)
            this.selector.set(newId, [updater, id])
            // const returned = updater({ ...this.args, calcWidth: this.calcWidth(this.args.proption) }, id)
            return () => this.selector.delete(generateId(id))
        }
    }

    addArray(ids, updater) {
        this.arraySelector.push([ids, updater])
    }
    calcWidth = proption => (time) => {
        const { xAxisWidth } = this.args
        return time /
            dayMillisedons
            * xAxisWidth
            / proption;
    }
    update(args = this.args) {
        this.args = args
        if (!this.updating) {
            // return;
        }
        this.updating = true

        let style = []
        style.push(
            `[data-gantt-id=${NodesGId}]{${NodesTransform(args)}}`
        )
        style.push(
            `${generateId(RowRectId)} 
            {
                width: ${args.xAxisWidth / args.proption}px;
            }
            `
        )

        // style.push(ColumnWidth(args));
        const callback = ([fn, id], key) => {
            const returned = fn({ ...args, calcWidth: this.calcWidth(args.proption) }, id);
            style.push(`${key}{
                ${returned}
            }`)
        }
        this.selector.forEach(callback)
        if (this.onceSelector.size) {
            const onceStyle = []
            this.onceSelector.forEach(function ([fn, id], key) {
                const returned = fn({
                    calcWidth: this.calcWidth(1),
                    proption: 1,
                    startX: 0,
                    transform: null
                }, id)
                onceStyle.push(`${key}{
                    ${returned}
                }`)
            })
            this.setStyle(this.onceEl, onceStyle.join(' '))
            this.onceSelector.clear();
        }
        if (!this.el) {
            return
        }
        this.setStyle(this.el, style.join(' '))
        this.updating = false
    }

    setStyle(el, style) {
        // window.requestAnimationFrame(() => {
        fastdom.measure(() => {
            const beforeHTML = el.innerHTML
            fastdom.mutate(() => {
                el.innerHTML = `
            ${style}
          `

            });
        });
        // })
    }

    setArgs(args) {
        this.args = args
    }
    appendStyle(el, style) {
        el.innerHTML = el.innerHTML + style
    }
}


export const styleUpdateMap = new StyleMap()

// styleUpdateMap.add(HelpRectRowId, function ({ totalWidth }) {
//     return `
//         width: ${totalWidth}px;
//     `
// })

export default StyleMap