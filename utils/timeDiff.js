const getNanos = require('./getNanos')

module.exports = (a ,b) => {
    const diff = getNanos(b) - getNanos(a)
    const seconds = Math.floor(diff / 1000000000)
    const nanoseconds = diff - (seconds * 1000000000)
    return [ seconds, nanoseconds ]
}