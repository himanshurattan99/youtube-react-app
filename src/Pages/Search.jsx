import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams, Link } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'
import cross_icon from '../assets/icons/cross-icon.png'

const Search = ({ sidebarExpanded = true, deviceType = 'desktop' }) => {
    // State for search results videos, channel data, sorting option and sort direction
    const [videos, setVideos] = useState({})
    const [channels, setChannels] = useState("")
    const [videoSort, setVideoSort] = useState("relevance")
    const [sortDirection, setSortDirection] = useState("desc")

    // Filter states: current selections, modal visibility, and original unfiltered videos
    const [filters, setFilters] = useState({
        uploadDate: 'any',
        duration: 'any'
    })
    const [showFilters, setShowFilters] = useState(false)
    const [originalVideos, setOriginalVideos] = useState({})

    // Extract search input from URL params
    const { searchInput } = useParams()
    // Check if current device is mobile
    const isMobileDevice = (deviceType === 'mobile')

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection((sortDirection === 'desc') ? 'asc' : 'desc')
    }

    // Updates a specific filter value
    const updateFilter = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value
        }))
    }

    // Resets all filters to default values
    const clearAllFilters = () => {
        setFilters({
            uploadDate: 'any',
            duration: 'any'
        })
    }

    // Filter videos based on search input when component mounts or search input changes
    useEffect(() => {
        // Filter videos that match the search input in title, description, category or channel name
        const filteredVideos = videoUtils.filterVideos(db.videos, searchInput)
        // Sort 'videos' based on selected option
        const sortedVideos = videoUtils.sortVideos(filteredVideos, videoSort, sortDirection, searchInput)
        setVideos(sortedVideos)

        setOriginalVideos(sortedVideos)
        setChannels(db.channels)
    }, [searchInput])

    // Re-sort videos when sort option or sort direction changes
    useEffect(() => {
        if (Object.keys(videos).length === 0) return

        // Sort 'videos' based on selected option
        const sortedVideos = videoUtils.sortVideos(videos, videoSort, sortDirection, searchInput)
        setVideos(sortedVideos)
    }, [videoSort, sortDirection])

    // Apply filters when filters or original videos change
    useEffect(() => {
        if (Object.keys(originalVideos).length === 0) return

        let filteredVideos = { ...originalVideos }

        // Apply all filters
        filteredVideos = videoUtils.applyFilters(filteredVideos, filters)

        setVideos(filteredVideos)
    }, [filters, originalVideos])

    return (
        <>
            <div className="h-[92.5vh] text-slate-100 overflow-y-auto scrollbar-thin-gray">
                <div className="p-3 lg:p-6 flex flex-col gap-4">
                    {/* Show message when no videos match the search */}
                    {(Object.entries(videos).length === 0) &&
                        <div className="text-lg font-medium">
                            {(videoUtils.normalizeText(searchInput) === '') ?
                                'Oops! That was too vague - try keywords like video titles, topics, or creator names'
                                : 'Oops! No videos found - try different keywords!'
                            }
                        </div>
                    }

                    {/* Videos sorting controls */}
                    {(Object.entries(videos).length !== 0) &&
                        <div className="flex gap-3 overflow-x-auto scrollbar-hidden">
                            <button onClick={() => setVideoSort("relevance")} type="button" className={`py-1 px-3 ${(videoSort === "relevance") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                                Relevance
                            </button>

                            <button onClick={() => setVideoSort("views")} type="button" className={`py-1 px-3 ${(videoSort === "views") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                                Views
                            </button>

                            <button onClick={() => setVideoSort("duration")} type="button" className={`py-1 px-3 ${(videoSort === "duration") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                                Duration
                            </button>

                            <button onClick={() => setVideoSort("likes")} type="button" className={`py-1 px-3 ${(videoSort === "likes") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                                Likes
                            </button>

                            <button onClick={() => setVideoSort("uploadDate")} type="button" className={`py-1 px-3 ${(videoSort === "uploadDate") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium whitespace-nowrap cursor-pointer`}>
                                Upload Date
                            </button>

                            <button onClick={() => toggleSortDirection()} type="button" className="py-1 px-3 bg-slate-100 hover:bg-[#2e2e2e] text-[#181818] hover:text-white rounded-md font-medium cursor-pointer">
                                {sortDirection === "desc" ? 'Descending' : 'Ascending'}
                            </button>

                            <button onClick={() => setShowFilters(true)} type="button" className="py-1 px-3 bg-slate-100 hover:bg-[#2e2e2e] text-[#181818] hover:text-white rounded-md font-medium cursor-pointer">
                                Filters
                            </button>
                        </div>
                    }

                    {/* Display each video that matches the search criteria */}
                    {Object.entries(videos).map(([key, value]) => {
                        return (
                            <div key={key} className="hover:bg-[#1e1e1e] rounded-lg flex flex-col sm:flex-row gap-2 sm:gap-3 cursor-pointer">
                                {/* Video thumbnail with duration overlay */}
                                <div className={`${(sidebarExpanded) ? 'md:w-1/2' : 'md:w-2/5'} lg:w-1/3 aspect-16/9 shrink-0 relative transition-transform hover:scale-105`}>
                                    <img src={value.thumbnail} className="aspect-video object-cover rounded-lg" alt="" />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {videoUtils.formatDuration(value.duration)}
                                    </span>
                                </div>

                                {/* Video metadata */}
                                <div className="flex-1 flex flex-row-reverse sm:flex-col gap-2 lg:gap-4">
                                    <div>
                                        <h3 className="mb-1 text-lg line-clamp-2">{value.title}</h3>
                                        <div className="text-xs text-[#aaa]">
                                            {(isMobileDevice) ? `${value.channelName} •` : ''} {videoUtils.formatViewsCount(value.views)} views • {videoUtils.getRelativeUploadTime(value.uploadDate)}
                                        </div>
                                    </div>
                                    <Link className="flex" to={`/channel/${value.channelId}`}>
                                        <div className="group flex items-center gap-2">
                                            <img src={channels[value.channelId].avatar} className="max-w-10 sm:w-7 rounded-full transition-transform duration-300 ease-in-out group-hover:rotate-360" alt="" />
                                            {(!isMobileDevice) &&
                                                <div className="text-xs text-[#aaa] group-hover:text-slate-100">{value.channelName}</div>
                                            }
                                        </div>
                                    </Link>
                                    {(!isMobileDevice) &&
                                        <div className="md:w-9/10 text-xs text-[#aaa] leading-5 line-clamp-1">{value.description}</div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Filters Modal */}
                {(showFilters) &&
                    <div className="bg-black/70 flex justify-center items-center absolute inset-0">
                        <div className="pt-3 pb-4 px-4 bg-[#2e2e2e] rounded-lg -translate-y-27">
                            <div className="mb-2 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg text-slate-100 font-medium">Filters</h3>

                                    <button onClick={clearAllFilters} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer" >
                                        Clear all
                                    </button>
                                </div>

                                <button onClick={() => setShowFilters(false)} className="hover:bg-[#3c3c3c] rounded-full cursor-pointer">
                                    <img src={cross_icon} className="size-7" alt="" />
                                </button>
                            </div>

                            <div className="flex gap-7">
                                {/* Upload Date Filter */}
                                <div className="text-sm text-[#aaa] flex flex-col gap-1">
                                    <h3 className="text-base text-slate-100 font-medium">Upload Date</h3>

                                    <button onClick={() => updateFilter('uploadDate', 'any')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'any') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Any Time
                                    </button>
                                    <button onClick={() => updateFilter('uploadDate', 'lastHour')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'lastHour') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Last Hour
                                    </button>
                                    <button onClick={() => updateFilter('uploadDate', 'today')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'today') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Today
                                    </button>
                                    <button onClick={() => updateFilter('uploadDate', 'thisWeek')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'thisWeek') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        This Week
                                    </button>
                                    <button onClick={() => updateFilter('uploadDate', 'thisMonth')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'thisMonth') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        This Month
                                    </button>
                                    <button onClick={() => updateFilter('uploadDate', 'thisYear')} className={`hover:text-slate-100 ${(filters['uploadDate'] === 'thisYear') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        This Year
                                    </button>
                                </div>

                                {/* Duration Filter */}
                                <div className="text-sm text-[#aaa] flex flex-col gap-1">
                                    <h3 className="text-base text-slate-100 font-medium">Duration</h3>

                                    <button onClick={() => updateFilter('duration', 'any')} className={`hover:text-slate-100 ${(filters['duration'] === 'any') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Any Duration
                                    </button>
                                    <button onClick={() => updateFilter('duration', 'short')} className={`hover:text-slate-100 ${(filters['duration'] === 'short') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Under 4 minutes
                                    </button>
                                    <button onClick={() => updateFilter('duration', 'medium')} className={`hover:text-slate-100 ${(filters['duration'] === 'medium') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        4 - 20 minutes
                                    </button>
                                    <button onClick={() => updateFilter('duration', 'long')} className={`hover:text-slate-100 ${(filters['duration'] === 'long') ? 'text-slate-100' : ''} text-left cursor-pointer`}>
                                        Over 20 minutes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Search