const { timeDiff } = require('./utils')
const Time = require('./Time')

class Timer {
    constructor() {
        this.startTime = null
        this.startDate = null
        this.currentTime = null
        this.started = false
        this.ended = false
        this.endTime = null
        this.times = new Map([])
    }

    get splits() {
        return (
            [ ...this.times ]
            .map(([name, time]) => {
                const diff = timeDiff(this.startTime, time)
                return [ name, new Time(diff) ]
            }, {})
        )
    }

    get diffs() {
        return (
            [ ...this.times ]
            .map(([name, time], i, arr) => {
                const diff = i === 0 ? timeDiff(this.startTime, time) : timeDiff(arr[i - 1][1], time)
                return [ name, new Time(diff) ]
            }, {})
        )
    }

    getSplit(splitName) {
        const split = this.times.get(splitName)
        if (!split) throw new Error(`No split with name "${splitName}"`)
        return new Time(timeDiff(this.startTime, split))
    }

    read() {
        if (this.ended) {
            return this.between('start', 'end')
        }
        return new Time(process.hrtime(this.currentTime))
    }

    split(name, { reset }={}) {
        if (this.times.has(name)) throw new Error(`Split already exists with name "${name}"`)
        const time = process.hrtime()
        const returnTime = this.since()
        this.times.set(name, time)
        if (reset) this.reset()
        return returnTime
    }

    reset() {
        const time = this.read()
        this.currentTime = process.hrtime()
        return time
    }

    stop() {
        this.endTime = process.hrtime(this.startTime)
        this.ended = true
        this.currentTime = this.endTime
        this.times.set('end', process.hrtime())
    }

    since(splitName) {
        if (!this.start) return 0
        let split
        if (splitName) {
            split = this.times.get(splitName)
        } else {
            split = Array.from(this.times.values()).pop()
        }
        if (!split) throw new Error(`No split with name "${splitName}"`)
        return new Time(process.hrtime(split))
    }

    between(splitName1, splitName2) {
        const split1 = this.times.get(splitName1)
        const split2 = this.times.get(splitName2)
        const time = timeDiff(split1, split2)
        return new Time(time)
    }

    start() {
        this.startTime = process.hrtime()
        this.startDateMillis = Date.now()
        this.startDate = new Date(this.startDateMillis)
        this.started = true
        this.currentTime = this.startTime
        this.times.set('start', process.hrtime())
        return this.startDate
    }
}

module.exports = Timer