// Helper function to format decimal numbers with specified precision
const truncateDecimal = (value, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces)
    return (Math.floor(value * factor) / factor).toString()
}

// Check if a word exists in the given text (returns 1 if found, else 0)
const containsWord = (text, word) => {
    return (text.includes(word)) ? 1 : 0
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

// Convert ISO duration format to total seconds
export const formatDurationToSeconds = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0

    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    return totalSeconds
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

// Calculate relevance score for a video based on search input
export const getRelevanceScore = (video, searchInput) => {
    // Split search input into individual words
    const searchInputWords = searchInput.trim().toLowerCase().split(/\s+/)

    const { title, channelName, description, category } = video
    // Weights for different match types
    const relevanceWeights = {
        titleMatch: 5,
        channelNameMatch: 3,
        categoryMatch: 2,
        descriptionMatch: 1,
        exactQueryInTitle: 12,
    }

    let score = 0
    // Add score for each word found in video properties
    searchInputWords.forEach((word) => {
        score += containsWord(title.toLowerCase(), word) * relevanceWeights.titleMatch +
            containsWord(channelName.toLowerCase(), word) * relevanceWeights.channelNameMatch +
            containsWord(category.toLowerCase(), word) * relevanceWeights.categoryMatch +
            containsWord(description.toLowerCase(), word) * relevanceWeights.descriptionMatch
    })
    // Bonus score if the entire search input is found in the title
    if (title.toLowerCase().includes(lowerCaseSearchInput)) {
        score += relevanceWeights.exactQueryInTitle
    }

    return score
}

// Capitalize the first letter of a given string
export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}