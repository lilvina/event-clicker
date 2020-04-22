const currentSeconds = () => Math.trunc(new Date() / 1000)

module.exports = (timeframe = 60 * 5) => {
  const counter = new Map()
  let cleanupLast = currentSeconds()

  const cleanup = () => {
    const toSeconds = currentSeconds() - timeframe - 1
    if(toSeconds > cleanupLast) {
      counter.forEach((_, timestamp) => {
        if(timestamp < toSeconds) {
          counter.delete(timestamp)
        }
      })
      cleanupLast = toSeconds
    }
  }

  const emit = () => {
    const seconds = currentSeconds()
    if(counter.get(seconds)) {
      counter.set(seconds, counter.get(seconds) + 1)
    } else {
      counter.set(seconds, 1)
    }
    cleanup()
  }

  const getCount = (secondsLast) => {
    if(!secondsLast || secondsLast > timeframe || secondsLast < 1) {
      return -1
    }

    const fromSeconds = currentSeconds() - secondsLast + 1
    let countTotal = 0

    counter.forEach((count, timestamp) => {
      if(timestamp >= fromSeconds) {
        countTotal += count
      }
    })
    return countTotal
  }
  return {emit, getCount}
}
