const { getProgress, startTracking, increaseCurrentProgress } = require("./progressTracker")

test('returns unavailable if no job is running with given id', () => {
    const progress = getProgress('jobId')
    expect(progress).toEqual('unavailable')
})

test('increases job progress', () => {
    startTracking('jobId', 10)
    increaseCurrentProgress('jobId')
    expect(getProgress('jobId')).toEqual('1 / 10')
})
