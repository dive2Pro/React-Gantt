import {
    NodesGId,
    HelpRectRowId
} from "./components/constants";

class StyleMap {

    constructor() {
        this.selector = new Map()
        const el = document.createElement('style');
        el.type = 'text/css';
        this.el = el;
        document.head.appendChild(el)
    }

    setEl(el) {
        this.el = el;
    }
    add(id, updater) {
        this.selector.set(id, updater)

    }

    update(args) {
        // 修改 
        let style = []
        this.selector.forEach((fn, key) => {
            // console.log(fn(proption))
            const returned = fn(args, key);
            const styleStr = Object.entries(returned).reduce((p, [key, value]) => {
                return p + `${key}:${value}; `
            }, ``)

            const str = `#gantt-xaxis [data-gantt-id="${key}"] {
          ${styleStr}
        }`
            style.push(str)
        })
        if (!this.el) {

            return
        }
        this.setStyle(style.join(' '))
    }

    setStyle(style) {
        window.requestAnimationFrame(() => {
            this.el.innerHTML = `
        ${style}
      `
        })

    }
}


export const styleUpdateMap = new StyleMap()

styleUpdateMap.add(HelpRectRowId, function ({ totalWidth }) {
    return {
        width: totalWidth + 'px'
    }
})
styleUpdateMap.add(NodesGId, function ({ transform }) {
    return {
        transform
    }
})

export default StyleMap