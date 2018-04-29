import {
    NodesGId,
    HelpRectRowId,
    dayMillisedons 
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
        const onceEl = document.createElement('style')
        onceEl.type = 'text/css'
        this.onceEl = onceEl
        document.head.appendChild(this.onceEl)
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
        } else {
            this.selector.set(generateId(id), [updater, id])
        }
    }

    addArray(ids, updater) {
        this.arraySelector.push([ids, updater])
    }
   
    update(args) {
        const calcWidth = proption => (time) => {
            const { xAxisWidth } = args
            return time /
              dayMillisedons 
              * xAxisWidth 
              / proption;
        }
        let style = []
        style.push(
            ` [data-gantt-id=${NodesGId}]{${NodesTransform(args)}}`
        )
        const callback = ([fn, id], key) => {
            const returned = fn({...args, calcWidth: calcWidth(args.proption)}, id);
            style.push(`${key}{
                ${returned}
            }`)
        }
        this.selector.forEach(callback)
        if (this.onceSelector.size) {
            const onceStyle = []
            this.onceSelector.forEach(function([fn, id], key) {
                const returned = fn({
                    calcWidth: calcWidth(1),
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
    }

    setStyle(el, style) {
        console.log(style)
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
}


export const styleUpdateMap = new StyleMap()

styleUpdateMap.add(HelpRectRowId, function ({ totalWidth }) {
    return `
        width: ${totalWidth}px;
    `
})

export default StyleMap