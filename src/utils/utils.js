// Helper function to format decimal numbers with specified precision
const truncateDecimal = (value, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces)
    return (Math.floor(value * factor) / factor).toString()
}

// Checks if text contains the specified word as a whole word (case-insensitive)
const containsWord = (text, word) => {
    const textWords = text.toLowerCase().split(/\s+/)

    for (const w of textWords) {
        if (w === word.trim().toLowerCase()) {
            return true
        }
    }

    return false
}

// Capitalize the first letter of a given string
export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Removes stop words from the input text
const removeStopWords = (text) => {
    const stopWords = [
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
        "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
        "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down",
        "during", "each", "few", "for", "from", "further", "had", "has", "have", "having",
        "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
        "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in",
        "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my",
        "myself", "no", "nor", "of", "off", "on", "once", "only", "or", "other", "ought",
        "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll",
        "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their",
        "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd",
        "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under",
        "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were",
        "what", "what's", "when", "when's", "where", "where's", "which", "while", "who",
        "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're",
        "you've", "your", "yours", "yourself", "yourselves"
    ]

    // Split text into words, filter out stop words, then rejoin
    return text.trim().toLowerCase().split(/\s+/).filter((word) => !stopWords.includes(word)).join(' ')
}

// Removes duplicate words from the input text while preserving order
const removeDuplicateWords = (text) => {
    const words = text.trim().toLowerCase().split(/\s+/)
    const uniqueWordsSet = new Set()
    const uniqueWords = []

    for (const word of words) {
        if (!uniqueWordsSet.has(word)) {
            uniqueWordsSet.add(word)
            uniqueWords.push(word)
        }
    }

    return uniqueWords.join(' ')
}

// Clean search input by removing punctuations, duplicates and stop words, returns lowercase string
export const normalizeText = (text) => {
    if (!text) return ''

    let normalizedText = text
        .toLowerCase()
        // Handle contractions by removing apostrophes and following letters
        .replace(/'\w*/g, '')
        // Convert underscores to spaces
        .replace(/_/g, ' ')
        // Remove all punctuation and special characters, keep only letters, numbers, spaces
        .replace(/[^\w\s]/g, ' ')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        .trim()

    normalizedText = removeStopWords(removeDuplicateWords(normalizedText))

    return normalizedText
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

// Get subscription feed videos sorted by upload date
export const getSubscriptionVideos = (videos, channels, userSubscribedChannelIds) => {
    // Get video IDs from all subscribed channels, then create and sort a videos object by upload date
    const videoIds = userSubscribedChannelIds.flatMap((element) => {
        return channels[element].videos
    })
    const sortedSubscriptionVideos = Object.fromEntries(
        videoIds.map((videoId) => [videoId, videos[videoId]])
            .sort(([, valueA], [, valueB]) =>
                new Date(valueB.uploadDate) - new Date(valueA.uploadDate)
            )
    )

    return sortedSubscriptionVideos
}

// Get random videos from a specific category
export const getCategoryVideos = (videos, category) => {
    const filteredVideos = Object.fromEntries(
        Object.entries(videos).filter(([_, video]) => {
            return video.category.toLowerCase() === category
        })
    )

    return getRandomVideos(filteredVideos)
}

// Calculate relevance score for a video based on search input
export const getRelevanceScore = (video, searchInput, normalizedQueryWords) => {
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
    normalizedQueryWords.forEach((word) => {
        score += containsWord(normalizeText(title), word) * relevanceWeights.titleMatch +
            containsWord(normalizeText(channelName), word) * relevanceWeights.channelNameMatch +
            containsWord(normalizeText(category), word) * relevanceWeights.categoryMatch +
            containsWord(normalizeText(description), word) * relevanceWeights.descriptionMatch
    })
    // Bonus score if the entire search input is found in the title
    if (title.toLowerCase().includes(searchInput.trim().toLowerCase())) {
        score += relevanceWeights.exactQueryInTitle
    }

    return score
}

// Filter videos that match the normalized search query in title, description, category or channel name
export const filterVideos = (videos, searchInput) => {
    // Normalize search input and split it into individual words
    const normalizedQuery = normalizeText(searchInput)
    const normalizedQueryWords = normalizedQuery.split(/\s+/)

    const filteredVideos = Object.fromEntries(
        Object.entries(videos)
            .filter(([_, videoData]) => {
                const { title, description, category, channelName } = videoData
                // Normalize all searchable fields
                const videoFields = [
                    normalizeText(title),
                    normalizeText(description),
                    normalizeText(category),
                    normalizeText(channelName)
                ]

                // Check if any normalized query word is found in at least one of the fields
                return normalizedQueryWords.some((word) =>
                    videoFields.some((field) => containsWord(field, word))
                )
            })
    )

    return filteredVideos
}

// Sort videos by specified criteria in ascending or descending order
export const sortVideos = (videos, videoSort, sortDirection = 'desc', searchInput = '') => {
    if (!videoSort || Object.keys(videos).length === 0) {
        return videos
    }

    // Normalize search input and split it into individual words
    const normalizedQuery = normalizeText(searchInput)
    const normalizedQueryWords = normalizedQuery.split(/\s+/)

    // Create a multiplier based on sort direction
    const sortFactor = (sortDirection === "desc") ? 1 : -1

    // Define different sorting functions
    const sortFunctions = {
        "relevance": ([, a], [, b]) => {
            return sortFactor * (getRelevanceScore(b, searchInput, normalizedQueryWords) - getRelevanceScore(a, searchInput, normalizedQueryWords))
        },
        "views": ([, a], [, b]) => {
            return sortFactor * (b.views - a.views)
        },
        "duration": ([, a], [, b]) => {
            return sortFactor * (formatDurationToSeconds(b.duration) - formatDurationToSeconds(a.duration))
        },
        "likes": ([, a], [, b]) => {
            return sortFactor * (b.likes - a.likes)
        },
        "uploadDate": ([, a], [, b]) => {
            return sortFactor * (new Date(b.uploadDate) - new Date(a.uploadDate))
        }
    }

    const sortFunction = sortFunctions[videoSort]
    if (!sortFunction) return videos

    // Sort 'videos' based on selected option
    const sortedVideos = Object.fromEntries(
        Object.entries(videos).sort(sortFunction)
    )

    return sortedVideos
}