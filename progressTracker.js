let runningJobs = []

function startTracking(jobId, total){
    runningJobs.push({
        id: jobId,
        current: 0,
        total: total
    })
}

function increaseCurrentProgress(jobId){
    const job = runningJobs.find(job => job.id === jobId)
    job.current++
}

function stopTracking(jobId){
    runningJobs = runningJobs.filter(job => job.id !== jobId)
}

function getProgress(jobId){
    const job = runningJobs.find(job => job.id === jobId)

    if(job) return `${job.current} / ${job.total}`
    return 'unavailable'
}

exports.startTracking = startTracking
exports.increaseCurrentProgress = increaseCurrentProgress
exports.stopTracking = stopTracking
exports.getProgress = getProgress