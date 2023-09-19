let fs = require('fs')

let addMins = (date, minutes) => new Date(date.getTime() + minutes * 60000)
let { format } = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
let log = console.log
let totalRating = 0
let printMovies = (runTime, ...movies) => movies.reduce((_, movie) => {
    let endTime = addMins(runTime, movie.dur)
    log(`${movie.Title} (${movie.Rating}) ${format(runTime)}-${format(endTime)}`)
    totalRating += movie.Rating
    runTime = endTime
    return endTime
}, 0)

let parseMovies = (remainingMovies, runTime) => {
    if (!remainingMovies.length) return

    let movie = remainingMovies.shift()
    let mod = movie.dur % 60
    let paired = remainingMovies.filter(m => m.avgRating >= 0.07)
        .find(m2 => (movie.dur + m2.dur) % 60 == 0)

    if (((!mod || mod >= 56) || (mod >= 50 && !paired)) && addMins(runTime, movie.dur).getDay() == 1) {
        return parseMovies(
            remainingMovies,
            addMins(printMovies(runTime, movie), mod ? 60 - mod : 0)
        )
    } else if (paired && addMins(runTime, movie.dur + paired.dur).getDay() == 1) {
        return parseMovies(
            remainingMovies.filter(m => m.i != paired.i),
            printMovies(runTime, movie, paired)
        )
    }

    return parseMovies(remainingMovies, runTime)
}

parseMovies(
    JSON.parse(fs.readFileSync('m')).map((movie, i) => ({
        i,
        ...movie,
        dur: movie.Duration,
        avgRating: movie.Rating / movie.Duration
    })).sort((a, b) => b.avgRating - a.avgRating),
    new Date(0, 0)
)

log('Total rating: ', totalRating.toFixed(1))
