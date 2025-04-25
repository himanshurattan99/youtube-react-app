import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'

const Channel = ({ sidebarExpanded = true, deviceType = 'desktop' }) => {
    // State for channel videos, channel info, and sorting option
    const [videos, setVideos] = useState({})
    const [channel, setChannel] = useState("")
    const [videoSort, setVideoSort] = useState("")

    // Get channel ID from URL params
    const { channelId } = useParams()
    // Get array of channel IDs that the user is subscribed to
    const userSubscriptions = db.users["helloworld"].subscriptions
    // Check if current device is mobile
    const isMobileDevice = (deviceType === 'mobile')

    // Load channel data and videos on component mount or when 'channelId' changes
    useEffect(() => {
        // Set initial channel data from database and default sort order to 'latest'
        setChannel(db.channels[channelId])
        setVideoSort("latest")

        // Get all video ids for this channel
        const videoIds = db.channels[channelId].videos

        // Create object of videos data for this channel
        const channelVideos = Object.fromEntries(
            videoIds.map((videoId) => {
                return [videoId, db.videos[videoId]]
            })
        )
        setVideos(channelVideos)
    }, [channelId])

    // Re-sort videos when sort option changes
    useEffect(() => {
        if (!videoSort || Object.keys(videos).length === 0) return

        // Define different sorting functions
        const sortFunctions = {
            "latest": ([, a], [, b]) => new Date(b.uploadDate) - new Date(a.uploadDate),
            "popular": ([, a], [, b]) => b.views - a.views,
            "oldest": ([, a], [, b]) => new Date(a.uploadDate) - new Date(b.uploadDate)
        }

        const sortFunction = sortFunctions[videoSort]
        if (!sortFunction) return

        // Sort 'videos' based on selected option
        const sortedVideos = Object.fromEntries(
            Object.entries(videos).sort(sortFunction)
        )
        setVideos(sortedVideos)
    }, [videoSort])

    return (
        <>
            <div className="h-[92.5vh] text-slate-100 overflow-y-auto scrollbar-thin-gray">
                {/* Channel header with banner and info */}
                <div className="py-1 px-3 lg:px-27 border-b border-b-[#3d3d3d]">
                    {/* Channel banner image */}
                    <div>
                        <img className={`${(isMobileDevice) ? 'h-24 object-cover' : ''} rounded-2xl`} src={channel.banner} alt="" />
                    </div>

                    {/* Channel profile section with avatar and details */}
                    <div className="mt-3 md:mt-7 mb-3 flex">
                        <div className="w-21 sm:w-28 lg:w-[12vw] shrink-0">
                            <img className="rounded-full" src={channel.avatar} alt="" />
                        </div>

                        {/* Channel details */}
                        <div className="pl-3 flex flex-col justify-center gap-2 md:gap-3">
                            <h1 className="text-3xl md:text-4xl font-medium">{channel.name}</h1>

                            {/* Channel metadata: handle, subscribers count, video count */}
                            <div className="text-sm md:text-base text-[#aaa] flex items-center">
                                <h2 className="text-slate-100 font-medium">@{channelId}</h2>
                                <span className="mx-1 md:mx-2">•</span>
                                <div>{videoUtils.formatSubscribersCount(channel.subscribers)} subscribers</div>
                                <span className="mx-1 md:mx-2">•</span>
                                <div>{(channel) ? channel.videos.length : ''} videos</div>
                            </div>

                            {/* Subscribe button - shows different states based on subscription status */}
                            <button type="button" className={`py-1 md:py-2 px-3 md:px-4 ${userSubscriptions.includes(channelId) ? 'bg-[#2e2e2e] hover:bg-[#3c3c3c]' : 'bg-slate-100 text-[#181818]'} rounded-3xl font-medium self-start cursor-pointer`}>
                                {userSubscriptions.includes(channelId) ?
                                    'Subscribed' : 'Subscribe'
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-2 px-3 lg:px-27">
                    {/* Videos sorting controls */}
                    <div className="flex gap-3">
                        <button onClick={() => setVideoSort("latest")} type="button" className={`py-1 px-3 ${(videoSort === "latest") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                            Latest
                        </button>

                        <button onClick={() => setVideoSort("popular")} type="button" className={`py-1 px-3 ${(videoSort === "popular") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                            Popular
                        </button>

                        <button onClick={() => setVideoSort("oldest")} type="button" className={`py-1 px-3 ${(videoSort === "oldest") ? 'bg-slate-100 text-[#181818]' : 'bg-[#2e2e2e] hover:bg-[#3c3c3c]'} rounded-md font-medium cursor-pointer`}>
                            Oldest
                        </button>
                    </div>

                    {/* Responsive video grid - displays channel videos */}
                    <div className={`mt-3 grid grid-cols-1 sm:grid-cols-2 ${(sidebarExpanded) ? 'md:grid-cols-2' : 'md:grid-cols-3'} lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3`}>
                        {Object.entries(videos).map(([key, value]) => {
                            return (
                                <div key={key} className="hover:bg-[#1e1e1e] rounded-lg cursor-pointer overflow-hidden transition-all hover:scale-105">
                                    {/* Video thumbnail with duration overlay */}
                                    <div className="relative">
                                        <img src={value.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                        <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                            {videoUtils.formatDuration(value.duration)}
                                        </span>
                                    </div>

                                    {/* Video metadata: title, views count, relative upload time */}
                                    <div className="py-3 flex">
                                        <div className="px-3 text-[#aaa] overflow-hidden">
                                            <h3 className="text-slate-100 font-medium leading-5 line-clamp-2">{value.title}</h3>
                                            <div className="mt-1 text-xs">{videoUtils.formatViewsCount(value.views)} views • {videoUtils.getRelativeUploadTime(value.uploadDate)}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Channel