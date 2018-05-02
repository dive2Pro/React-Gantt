import React from 'react'


class PositionManager {
    constructor({ itemCount, getItemSize, estimatedItemSize }) {
        this.itemCount = itemCount
        this.getItemSize = getItemSize
        this.estimatedItemSize = estimatedItemSize

        this.dataIndexCache = {}
        this.lastMeasuredIndex = -1
    }
    getTotal = () => {
        const lastMeasuredDatum = this.getLastMeasuredDatum()

        return lastMeasuredDatum.offset + lastMeasuredDatum.size + (this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize
    }
    getVisibleRange = ({ offset, containerSize, overscanCount }) => {
        const total = this.getTotal()
        if (total == 0) {
            return {}
        }

        const maxOffset = offset + containerSize
        const start = this.getNestestIndexForOffset(offset)
        let stop = start

        const startDatum = this.getDatumForIndex(start)

        // 这里 offset 考虑了 start 的高度
        offset = startDatum.offset + startDatum.size

        while (offset < maxOffset) {
            stop++
            offset += this.getDatumForIndex(stop).size
        }

        return {
            start,
            stop
        }

    }
    getDatumForIndex = index => {
        if (index > this.lastMeasuredIndex) {
            const lastDatum = this.getLastMeasuredDatum()
            const { getItemSize } = this
            let offset = lastDatum.offset + lastDatum.size
            for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
                const size = getItemSize(i)
                this.dataIndexCache[i] = {
                    size,
                    offset
                }
                offset += size
            }
            this.lastMeasuredIndex = index
        }

        return this.dataIndexCache[index]
    }

    getLastMeasuredDatum = () => {
        return this.dataIndexCache[this.lastMeasuredIndex] ? this.dataIndexCache[this.lastMeasuredIndex] : {
            offset: 0,
            size: this.estimatedItemSize
        }
    }

    getNestestIndexForOffset = offset => {
        const { itemCount, getItemSize } = this
        const lastMeasuredDatum = this.getLastMeasuredDatum()
        const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex)

        if (offset <= lastMeasuredDatum.offset) {
            return this.binarySearch({
                low: 0,
                high: lastMeasuredIndex,
                offset
            })
        } else {
            return this.exponentialSearch({
                index: lastMeasuredIndex,
                offset
            })
        }
    }

    exponentialSearch = ({ index, offset }) => {
        let inteval = 1
        const { itemCount } = this

        while (index < itemCount && this.getDatumForIndex(index).offset < offset) {
            index += inteval
            inteval *= 2
        }

        return this.binarySearch({
            offset,
            low: 0,
            high: index
        })
    }

    binarySearch = ({ offset, low, high }) => {
        let currentOffset = offset
        let middle = 0

        while (low < high) {
            middle = low + Math.floor((high - low) / 2)

            currentOffset = this.getDatumForIndex(middle).offset
            if (currentOffset === offset) {
                return middle
            } else if (currentOffset < offset) {
                low = middle + 1
            } else if (currentOffset > offset) {
                high = middle - 1
            }
        }

        if (low > 0) {
            return low - 1
        }

        return 0
    }
}

export default class VirtualizeList extends React.PureComponent {

    static defaultProps = {
        estimatedItemSize: 50,
    }
    state = {
        offset: 0
    }
    constructor(props) {
        super(props)

        this._positionManager = new PositionManager({
            itemCount: props.itemCount,
            getItemSize: index => this.getItemSize(index),
            estimatedItemSize: props.estimatedItemSize
        })

    }

    getItemSize = index => {
        const { ItemSize } = this.props

        if (typeof ItemSize === 'function') {
            return ItemSize(index)
        }

        return Array.isArray(ItemSize) ? ItemSize[index] : ItemSize
    }

    handleScroll = ({ target }) => {
        const { scrollTop } = target
        this.setState({
            offset: scrollTop
        })
    }

    getStyle = index => {
        const { offset, size } = this._positionManager.getDatumForIndex(index)

        return {
            position: 'absolute',
            offset,
            size
        }
    }

    render() {
        const { offset } = this.state
        const { renderWrapper, renderItem, containerSize, overscanCount } = this.props

        const { start, stop } = this._positionManager.getVisibleRange({
            offset,
            containerSize,
            overscanCount
        })
        if (Number.isNaN(start) || Number.isNaN(stop)) {
            throw new Error(`start (${start}) or stop(${stop}) not expected number`)
        }
        if (start > stop) {
            throw new Error(`start(${start}) greater than stop (${stop})`)
        }

        const items = []
        for (let i = start; i < stop; i++) {
            items.push(
                renderItem(
                    i,
                    this.getStyle(i)
                )
            )
        }
        if (renderWrapper) {
            return renderWrapper({
                handleScroll: this.handleScroll,
                items,
                totalHeight: this._positionManager.getTotal()
            })
        }
        return <div onScroll={this.handleScroll}>
            <div> {items} </div>
        </div>
    }
}