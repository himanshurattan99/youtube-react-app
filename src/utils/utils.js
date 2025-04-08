// Helper function to format decimal numbers with specified precision
const truncateDecimal = (value, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces)
    return (Math.floor(value * factor) / factor).toString()
}

// Convert ISO duration format to HH:MM:SS format
export const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = match[1] ? match[1].replace("H", "") : "0"
    const minutes = match[2] ? match[2].replace("M", "") : "0"
    const seconds = match[3] ? match[3].replace("S", "") : "0"

    const formattedMinutes = minutes.padStart(2, "0")
    const formattedSeconds = seconds.padStart(2, "0")

    const formattedDuration = (hours === "0") ? `${formattedMinutes}:${formattedSeconds}` : `${hours.padStart(2, "0")}:${formattedMinutes}:${formattedSeconds}`
    return formattedDuration.trim()
}

// Format views count with K, M, B suffixes
export const formatViewsCount = (viewsCount) => {
    let formattedValue = viewsCount

    if (viewsCount >= 1000000000) {
        // Format billions
        const value = viewsCount / 1000000000
        formattedValue = (viewsCount < 10000000000) ?
            `${truncateDecimal(value, 1).replace(/\.0$/, '')}B` : `${Math.floor(value)}B`
    }
    else if (viewsCount >= 1000000) {
        // Format millions
        const value = viewsCount / 1000000
        formattedValue = (viewsCount < 10000000) ?
            `${truncateDecimal(value, 1).replace(/\.0$/, '')}M` : `${Math.floor(value)}M`
    }
    else if (viewsCount >= 1000) {
        // Format thousands
        const value = viewsCount / 1000
        formattedValue = (viewsCount < 10000) ?
            `${truncateDecimal(value, 1).replace(/\.0$/, '')}K` : `${Math.floor(value)}K`
    }

    return formattedValue
}

// Format subscribers count with more precision than views count
export const formatSubscribersCount = (subscribersCount) => {
    let formattedValue = subscribersCount

    if (subscribersCount >= 1000000000) {
        // Format billions
        const value = subscribersCount / 1000000000
        formattedValue = `${truncateDecimal(value, 1).replace(/\.0$/, '')}B`
    }
    else if (subscribersCount >= 1000000) {
        // Format millions with precision based on size
        const value = subscribersCount / 1000000
        formattedValue = (subscribersCount < 10000000) ?
            `${truncateDecimal(value, 2).replace(/\.0+$/, '')}M`
            : ((subscribersCount < 100000000) ?
                `${truncateDecimal(value, 1).replace(/\.0$/, '')}M` : `${Math.floor(value)}M`)
    }
    else if (subscribersCount >= 1000) {
        // Format thousands with precision based on size
        const value = subscribersCount / 1000
        formattedValue = (subscribersCount < 10000) ?
            `${truncateDecimal(value, 2).replace(/\.0+$/, '')}K`
            : ((subscribersCount < 100000) ?
                `${truncateDecimal(value, 1).replace(/\.0+$/, '')}K` : `${Math.floor(value)}K`)
    }

    return formattedValue
}

// Calculate relative time (e.g., "2 days ago")
export const getRelativeUploadTime = (uploadDate) => {
    const now = new Date()
    const past = new Date(uploadDate)
    const seconds = Math.floor((now - past) / 1000)

    // Time intervals in seconds
    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ]
    for (let interval of intervals) {
        const count = Math.floor(seconds / interval.seconds)
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
        }
    }

    return "just now"
}

// Get random videos from the video collection
export const getRandomVideos = (videos, count = 12) => {
    const videoEntries = Object.entries(videos)

    // Shuffle videos using random sorting and take the first 'count' videos
    const shuffledVideos = videoEntries.sort(() => (0.5 - Math.random()))
    const randomVideos = Object.fromEntries(shuffledVideos.slice(0, count))

    return randomVideos
}

// Capitalize the first letter of a given string
export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}