const fs = require('fs')

let ceilToHour = minutes => Math.ceil(minutes / 60) * 60

let dynamicProgramming = movies => {
    let durations = movies.map(movie => ceilToHour(movie.Duration))
    let ratings = movies.map(movie => movie.Rating)
    let n = movies.length
    let W = 24 * 60

    let dp = Array(n + 1)
        .fill(null)
        .map(() => Array(W + 1).fill(0))
    let keep = Array(n + 1)
        .fill(null)
        .map(() => Array(W + 1).fill(false))

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (durations[i - 1] <= w) {
                if (
                    ratings[i - 1] + dp[i - 1][w - durations[i - 1]] >
                    dp[i - 1][w]
                ) {
                    dp[i][w] = ratings[i - 1] + dp[i - 1][w - durations[i - 1]]
                    keep[i][w] = true
                } else {
                    dp[i][w] = dp[i - 1][w]
                }
            } else {
                dp[i][w] = dp[i - 1][w]
            }
        }
    }

    let result = []
    let k = W
    let currentTime = 0

    for (let i = n; i > 0; i--) {
        if (keep[i][k]) {
            let duration = movies[i - 1].Duration
            let start = currentTime
            let end = currentTime + duration

            result.push({
                title: movies[i - 1].Title,
                rating: ratings[i - 1],
                start: start,
                end: end,
            })

            currentTime += ceilToHour(duration)
            k = k - durations[i - 1]
        }
    }

    return {
        schedule: result,
        totalRating: dp[n][W],
    }
}

let formatTime = minutes => {
    let hours = Math.floor(minutes / 60)
    let minutesRemaining = minutes % 60
    return `${String(hours).padStart(2, '0')}:${String(
        minutesRemaining
    ).padStart(2, '0')}`
}

let formatSchedule = schedule => {
    let orderedSchedule = schedule.schedule.sort((a, b) => a.start - b.start)
    orderedSchedule.forEach(movie =>
        console.log(`${movie.title} (${movie.rating}) [${formatTime(movie.start)}-${formatTime(
            movie.end
        )}]`)
    )
    console.log(`Total Rating: ${schedule.totalRating}`)
}

fs.readFile('movies.json', 'utf8', (err, data) => {
    let movies = JSON.parse(data)
    let bestSchedule = dynamicProgramming(movies)
    formatSchedule(bestSchedule)
})
