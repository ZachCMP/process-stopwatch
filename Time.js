const { getNanos } = require('./utils')

class Time {
    constructor(timeArr) {
        this.raw = timeArr
    }

    get millis() {
        return Math.floor((this.raw[0] * 1000) + (this.raw[1] / 1000000))
    }

    get nanos() {
        return getNanos(this.raw)
    }
}

module.exports = Time