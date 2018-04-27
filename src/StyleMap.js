import {
    NodesGId,
    HelpRectRowId
} from "./components/constants";
import fastdom from 'fastdom'
import { throttle } from 'lodash'
function generateId(id) {
    return `#gantt-xaxis [data-gantt-id="${id}"]`
}
class StyleMap {
    addToOnce = false
    constructor() {
        this.selector = new Map()
        this.arraySelector = new Array()
        const el = document.createElement('style');
        el.type = 'text/css';
        this.el = el;
        document.head.appendChild(el)
        // this.update = throttle(this.update, 16, true);
        this.onceSelector = new Map();
    }

    setEl(el) {
        this.el = el;
    }
    toggleOnce() {
        this.addToOnce = !this.addToOnce
    }
    add(id, updater) {
        if (this.addToOnce) {
            this.onceSelector.set(generateId(id), [updater, id])
        } else {
            this.selector.set(generateId(id), [updater, id])
        }
    }

    addArray(ids, updater) {
        this.arraySelector.push([ids, updater])
    }

    update(args) {
        // 修改 
        let style = []
        // TODO 删除 - readOnly 的 id
        const callback = ([fn, id], key) => {
            const returned = fn(args, id);
            style.push(`${key}{
                ${returned}
            }`)
        }
        this.selector.forEach(callback)
        if (this.onceSelector.size) {
            this.onceSelector.forEach(callback)
            this.onceSelector.clear();
        }
        if (!this.el) {

            return
        }
        this.setStyle(style.join(' '))
    }

    setStyle(style) {
        // window.requestAnimationFrame(() => {
        fastdom.measure(() => {
            const beforeHTML = this.el.innerHTML
            fastdom.mutate(() => {
                this.el.innerHTML = `
                ${style}
              `

            });
        });
        // })

    }
}


export const styleUpdateMap = new StyleMap()

styleUpdateMap.add(HelpRectRowId, function ({ totalWidth }) {
    return `
        width: ${totalWidth}px;
    `
})
styleUpdateMap.add(NodesGId, function ({ transform }) {
    return `
        transform:${transform};
    `
})

export default StyleMap