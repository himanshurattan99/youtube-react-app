import { videos, channels, users } from '../data/db.js'

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

// Remove punctuation and formatting from text, keeping only letters, numbers, and spaces
const removePunctuationAndFormatting = (text) => {
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

    return normalizedText
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

    let normalizedText = removePunctuationAndFormatting(text)

    normalizedText = removeStopWords(removeDuplicateWords(normalizedText))

    return normalizedText
}

// Convert duration in seconds to HH:MM:SS format
export const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

    // Only show hours if video is 1 hour or longer
    if (hours > 0) {
        const formattedHours = hours.toString().padStart(2, '0')
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    } else {
        return `${formattedMinutes}:${formattedSeconds}`
    }
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

// Get video data by video ID, returns undefined if video doesn't exist
export const getVideoData = (videoId) => {
    return videos[videoId]
}

// Get channel data by channel ID, returns undefined if channel doesn't exist
export const getChannelData = (channelId) => {
    return channels[channelId]
}

// Get channel avatar URL by channel ID
export const getChannelAvatar = (channelId) => {
    const channelData = getChannelData(channelId)
    return channelData?.avatar
}

// Get array of channel IDs that the current user is subscribed to
export const getUserSubscribedChannelIds = () => {
    return users["helloworld"].subscribedChannels
}

// Get channel data for all channels the current user is subscribed to
export const getUserSubscribedChannelsData = () => {
    // Get array of channel IDs that the user is subscribed to
    const userSubscribedChannelIds = getUserSubscribedChannelIds()

    // Filter to include only user's subscribed channels
    const filteredChannels = {}
    userSubscribedChannelIds.forEach((channelId) => {
        if (getChannelData(channelId)) {
            filteredChannels[channelId] = getChannelData(channelId)
        }
    })

    return filteredChannels
}

// Get random videos from the video collection
export const getRandomVideos = ({ videosData = videos, count = 12 } = {}) => {
    const videoEntries = Object.entries(videosData)

    // Shuffle videos using random sorting and take the first 'count' videos
    const shuffledVideos = videoEntries.sort(() => (0.5 - Math.random()))
    const randomVideos = Object.fromEntries(shuffledVideos.slice(0, count))

    return randomVideos
}

// Get random videos from a specific category
export const getCategoryVideos = ({ videosData = videos, category }) => {
    const filteredVideos = Object.fromEntries(
        Object.entries(videosData).filter(([_, video]) => {
            return video.category.toLowerCase() === category
        })
    )

    return getRandomVideos({ videosData: filteredVideos })
}

// Get all videos for a specific channel
export const getChannelVideos = (channelId) => {
    const channelData = getChannelData(channelId)

    if (!(channelData)) {
        return {}
    }

    // Get all video ids for this channel
    const videoIds = channelData.videos

    // Create object of videos data for this channel
    const channelVideos = Object.fromEntries(
        videoIds.map((videoId) => {
            return [videoId, getVideoData(videoId)]
        })
    )

    return channelVideos
}

// Get subscription feed videos sorted by upload date
export const getSubscriptionVideos = () => {
    // Get array of channel IDs that the user is subscribed to
    const userSubscribedChannelIds = getUserSubscribedChannelIds("helloworld")
    if (userSubscribedChannelIds.length === 0) {
        return {}
    }

    // Get videos from all subscribed channels
    const userSubscriptionVideos = {}
    userSubscribedChannelIds.forEach((channelId) => {
        const channelVideos = getChannelVideos(channelId)
        Object.assign(userSubscriptionVideos, channelVideos)
    })

    // Sort videos by upload date (newest first)
    const sortedSubscriptionVideos = Object.fromEntries(
        Object.entries(userSubscriptionVideos)
            .sort(([, valueA], [, valueB]) =>
                new Date(valueB.uploadDate) - new Date(valueA.uploadDate)
            )
    )

    return sortedSubscriptionVideos
}

// Calculate relevance score for a video based on search input
export const getRelevanceScore = (videoData, searchInput, normalizedQueryWords) => {
    const { title, channelName, description, category } = videoData
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
export const filterVideos = ({ videosData = videos, searchInput } = {}) => {
    // Normalize search input and split it into individual words
    const normalizedQuery = normalizeText(searchInput)
    const normalizedQueryWords = normalizedQuery.split(/\s+/)

    const filteredVideos = Object.fromEntries(
        Object.entries(videosData)
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

// Filters channel videos based on search input
export const filterChannelVideos = ({ channelVideosData = {}, searchInput } = {}) => {
    if (Object.entries(channelVideosData).length === 0) {
        return {}
    }

    // Normalize search input and split it into individual words
    const normalizedQuery = removeDuplicateWords(removePunctuationAndFormatting(searchInput))
    const normalizedQueryWords = normalizedQuery.split(/\s+/)

    if (normalizedQuery === '') {
        return channelVideosData
    } else {
        const filteredVideos = Object.fromEntries(
            Object.entries(channelVideosData)
                .filter(([_, videoData]) => {
                    const { title, description, category, channelName } = videoData

                    /// Convert all searchable fields to lowercase
                    const videoFields = [
                        title.toLowerCase(),
                        description.toLowerCase(),
                        category.toLowerCase(),
                        channelName.toLowerCase()
                    ]

                    // Check if any normalized query word is found in at least one of the fields
                    return normalizedQueryWords.some((word) =>
                        videoFields.some((field) => field.includes(word))
                    )
                })
        )

        return filteredVideos
    }
}

// Sort videos by specified criteria in ascending or descending order
export const sortVideos = ({ videosData, videoSort, sortDirection = 'desc', searchInput = '' }) => {
    if (!videoSort || Object.keys(videosData).length === 0) {
        return videosData
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
    if (!sortFunction) return videosData

    // Sort 'videosData' based on selected option
    const sortedVideos = Object.fromEntries(
        Object.entries(videosData).sort(sortFunction)
    )

    return sortedVideos
}

// Sort channel videos by specified criteria
export const sortChannelVideos = ({ channelVideosData, videoSort }) => {
    if (!videoSort || Object.keys(channelVideosData).length === 0) {
        return channelVideosData
    }

    // Define different sorting functions
    const sortFunctions = {
        "latest": ([, a], [, b]) => new Date(b.uploadDate) - new Date(a.uploadDate),
        "popular": ([, a], [, b]) => b.views - a.views,
        "oldest": ([, a], [, b]) => new Date(a.uploadDate) - new Date(b.uploadDate)
    }

    const sortFunction = sortFunctions[videoSort]
    if (!sortFunction) return channelVideosData

    // Sort 'channelVideosData' based on selected option
    const sortedVideos = Object.fromEntries(
        Object.entries(channelVideosData).sort(sortFunction)
    )

    return sortedVideos
}

// Filter videos based on upload date
export const filterByUploadDate = ({ videosData = {}, uploadDateFilter = 'any' } = {}) => {
    if (uploadDateFilter === "any") return videosData

    const now = new Date()

    const filteredVideos = Object.fromEntries(
        Object.entries(videosData).filter(([_, videoData]) => {
            // Calculate days since upload
            const uploadDate = new Date(videoData.uploadDate)
            const diffTime = now - uploadDate
            const diffDays = diffTime / (1000 * 60 * 60 * 24)

            // Define filter thresholds in days
            const filterThresholds = {
                lastHour: 1 / 24,
                today: 1,
                thisWeek: 7,
                thisMonth: 30,
                thisYear: 365
            }

            // Check if video falls within filter range
            const maxDays = filterThresholds[uploadDateFilter]
            return diffDays < maxDays
        })
    )

    return filteredVideos
}

// Filter videos based on duration
export const filterByDuration = ({ videosData = {}, durationFilter = 'any' } = {}) => {
    if (durationFilter === "any") return videosData

    const filteredVideos = Object.fromEntries(
        Object.entries(videosData).filter(([_, videoData]) => {
            // Convert duration in ISO format to seconds
            const duration = formatDurationToSeconds(videoData.duration)

            // Define filter thresholds in seconds
            const filterThresholds = {
                short: { min: 0, max: 240 },        // under 4 minutes
                medium: { min: 240, max: 1200 },    // 4-20 minutes
                long: { min: 1200, max: Infinity }  // over 20 minutes
            }

            // Check if video falls within filter range
            const range = filterThresholds[durationFilter]
            return (duration >= range.min) && (duration < range.max)
        })
    )

    return filteredVideos
}

// Apply all active filters to videos
export const applyFilters = ({ videosData = {}, filters } = {}) => {
    let filteredVideos = { ...videosData }

    // Apply upload date filter
    if (filters.uploadDate !== 'any') {
        filteredVideos = filterByUploadDate({ videosData: filteredVideos, uploadDateFilter: filters.uploadDate })
    }

    // Apply duration filter
    if (filters.duration !== 'any') {
        filteredVideos = filterByDuration({ videosData: filteredVideos, durationFilter: filters.duration })
    }

    return filteredVideos
}