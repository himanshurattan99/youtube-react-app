import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams, Link } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'

const Channel = ({ sidebarExpanded = true }) => {
    // State for search results videos and channel data
    const [videos, setVideos] = useState({})
    const [channels, setChannels] = useState("")

    // Extract search input from URL params
    const { searchInput } = useParams()

    // Filter videos based on search input when component mounts or search input changes
    useEffect(() => {
        // Filter videos that match the search input in title, description, category or channel name
        const filteredVideos = Object.fromEntries(
            Object.entries(db.videos)
                .filter(([_, value]) => {
                    const lowerCaseSearchInput = searchInput.toLowerCase()
                    const { title, description, category, channelName } = value

                    return (
                        title.toLowerCase().includes(lowerCaseSearchInput) ||
                        description.toLowerCase().includes(lowerCaseSearchInput) ||
                        category.toLowerCase().includes(lowerCaseSearchInput) ||
                        channelName.toLowerCase().includes(lowerCaseSearchInput)
                    )
                })
        )
        setVideos(filteredVideos)
        setChannels(db.channels)
    }, [searchInput])

    return (
        <>
            <div className="h-[92.5vh] text-slate-100 overflow-y-auto scrollbar-thin-gray">
                <div className="p-6 flex flex-col gap-4">
                    {/* Show message when no videos match the search */}
                    {(Object.entries(videos).length === 0) &&
                        <div className="text-lg font-medium">No videos found !!!</div>
                    }

                    {/* Display each video that matches the search criteria */}
                    {Object.entries(videos).map(([key, value]) => {
                        return (
                            <div key={key} className="hover:bg-[#1e1e1e] rounded-lg flex gap-3 cursor-pointer">
                                {/* Video thumbnail with duration overlay */}
                                <div className="w-1/3 aspect-16/9 shrink-0 relative transition-transform hover:scale-105">
                                    <img src={value.thumbnail} className="aspect-video object-cover rounded-lg" alt="" />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {videoUtils.formatDuration(value.duration)}
                                    </span>
                                </div>

                                {/* Video metadata */}
                                <div className="flex-1">
                                    <h3 className="text-lg">{value.title}</h3>
                                    <div className="mt-1 text-xs text-[#aaa]">{videoUtils.formatViewsCount(value.views)} views • {videoUtils.getRelativeUploadTime(value.uploadDate)}</div>
                                    <Link className="flex" to={`/${value.channelId}`}>
                                        <div className="group my-4 flex items-center gap-2">
                                            <img src={channels[value.channelId].avatar} className="w-7 rounded-full transition-transform duration-300 ease-in-out group-hover:rotate-360" alt="" />
                                            <div className="text-xs text-[#aaa] group-hover:text-slate-100">{value.channelName}</div>
                                        </div>
                                    </Link>
                                    <div className="pr-24 text-xs text-[#aaa] leading-5 line-clamp-1">{value.description}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Channel