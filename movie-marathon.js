let fs = require('fs')

let addMins = (date, minutes) => new Date(date.getTime() + minutes * 60000)

let movies = JSON.parse(fs.readFileSync('m')).map((movie, i) => ({
    i,
    ...movie,
    dur: movie.Duration,
    avgRating: movie.Rating / movie.Duration
})).sort((a, b) => b.avgRating - a.avgRating)

let schedule = []
let totalDuration = 0

movies.forEach(movie => {
    let { i, dur } = movie
    if (schedule.some(m => m.i == i)) return

    let mod = dur % 60
    let paired = movies.filter(m => m.avgRating >= 0.07 && m.i != i && !schedule.some(x => x.i == m.i))
        .find(m2 => (dur + m2.dur) % 60 == 0)

    if (((mod == 0 || mod >= 55) || (mod >= 45 && !paired)) && totalDuration + dur <= 1440) {
        schedule.push(movie)
        totalDuration += mod == 0 ? dur : dur + (60 - mod)
    } else if (paired && totalDuration + dur + paired.dur <= 1440) {
        schedule.push(movie, paired)
        totalDuration += dur + paired.dur
    }
})

let runTime = new Date(0, 0)

let { format } = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
let log = console.log

schedule.forEach(m => {
    let minMod = runTime.getMinutes() % 60
    let minDiff = minMod == 0 ? 0 : 60 - minMod
    let startTime = minDiff > 0 && addMins(runTime, m.dur).getMinutes() != 0 ? addMins(runTime, minDiff) : runTime
    let endTime = addMins(startTime, m.dur)

    log(`${m.Title} (${m.Rating}) ${format(startTime)}-${format(endTime)}`)

    runTime = endTime
})

log('Total rating: ', schedule.reduce((acc, movie) => acc + movie.Rating, 0).toFixed(1))
