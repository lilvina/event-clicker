const EventCounter = require('event-counter')

const sleep = (millisecond) => new Promise((resolve) => setTimeout(resolve, millisecond))

describe('Event counter test suite', () => {
  describe('Signal tests', () => {
    test('Signals should be registered', () => {
      const counter = EventCounter()
      Array.from(Array(10)).forEach(counter.emit)
      expect(counter.getCount(1)).toBe(10)
    })

    test('When signals are fired every second, it should distinctly register each signal count', async () => {
      const counter = EventCounter()

      await Promise.all(
        Array.from(Array(10)).map(async(_, index) => {
          await sleep(1000 * index)
          return counter.emit()
        }),
      )
      expect(counter.getCount(1).toEqual(1))
    }, 10000)

    test('When multiple signals are fired every second, it should register each signal count', async () => {
      const counter = EventCounter()

      await Promise.all(
        Array.from(Array(10)).map(async(_, index) => {
          await sleep(1000 * index)
          return Array.from(Array(10)).map(counter.emit)
        }),
      )
      expect(counter.getCount(1).toEqual(10))
    }, 10000)
  })

  describe('Get count test', () => {
    test('Should get the last 5 seconds to return the count of signals fired in the last 5 seconds', async () => {
      const counter = EventCounter()

      await Promise.all(
        Array.from(Array(10)).map(async(_, index) => {
          await sleep(1000 * index)
          return counter.emit()
        }),
      )
      expect(counter.getCount(5).toEqual(50))
    }, 10000)

    test('Should return 0 if there are no events in the timeframe', async () => {
      const counter = EventCounter()

      expect(counter.getCount(5).toEqual(0))
    }, 10000)
  })
  describe('Cleanup tests', () => {
    test('Should return -1 as the count is past time frame, meaning stale data cannot be accessed', async () => {
      const counter = EventCounter(1)

      await Promise.all(
        Array.from(Array(10)).map(async(_, index) => {
          await sleep(1000 * index)
          return Array.from(Array(10)).map(counter.emit)
        }),
      )
      expect(counter.getCount(5).toEqual(-1))
    }, 10000)
  })
})
