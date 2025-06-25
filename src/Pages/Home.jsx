import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams, useLocation, Link } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'

const Home = ({ homeVideos = {}, setHomeVideos, categoryVideosCache = {}, setCategoryVideosCache, sidebarExpanded = true }) => {
    // State for videos and channels data
    const [videos, setVideos] = useState({})
    const [channels, setChannels] = useState({})

    // Extract category from URL params and current location from router state
    const { category } = useParams()
    const location = useLocation()

    // Load videos based on current route
    useEffect(() => {
        // Subscription feed: Get videos from user's subscribed channels
        if (location.pathname === '/subscriptions') {
            // Get array of channel IDs that the user is subscribed to
            const userSubscribedChannelIds = db.users["helloworld"].subscribedChannels

            const sortedSubscriptionVideos = videoUtils.getSubscriptionVideos(db.videos, db.channels, userSubscribedChannelIds)
            setVideos(sortedSubscriptionVideos)
        }
        // Home page: Display random video recommendations
        else if (!(category)) {
            // Generate new random videos or use cached ones
            if (Object.entries(homeVideos).length === 0) {
                const randomVideos = videoUtils.getRandomVideos(db.videos)
                setVideos(randomVideos)
                setHomeVideos(randomVideos)
            }
            else {
                setVideos(homeVideos)
            }
        }
        // Category page: Filter videos by selected category
        else {
            // Fetch new category videos or use cached ones
            if (!categoryVideosCache[category] || Object.entries(categoryVideosCache[category]).length === 0) {
                const categoryVideos = videoUtils.getCategoryVideos(db.videos, category)
                setVideos(categoryVideos)
                setCategoryVideosCache((prev) => ({
                    ...prev,
                    [category]: categoryVideos
                }))
            }
            else {
                setVideos(categoryVideosCache[category])
            }
        }

        // Load all channel data for displaying channel information with videos
        setChannels(db.channels)
    }, [location])

    return (
        <div className="h-[92.5vh] p-3 lg:p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto scrollbar-thin-gray">
            {/* Show error message for empty categories or dynamic section heading based on current route */}
            {(Object.entries(videos).length === 0 && category) ?
                (
                    <div className="text-lg font-medium">
                        Oops! No videos found - try different categories!
                    </div>
                )
                : (
                    <h2 className="mb-6 text-xl font-bold">
                        {(!(category) && location.pathname !== '/subscriptions') ?
                            'Recommended'
                            : (category) ?
                                videoUtils.capitalize(category) : 'Subscriptions'
                        }
                    </h2>
                )
            }

            {/* Responsive video grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${(sidebarExpanded) ? 'md:grid-cols-2' : 'md:grid-cols-3'} lg:grid-cols-4 gap-y-2 lg:gap-y-5 md:gap-x-3`}>
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

                            <div className="py-3 flex">
                                {/* Channel avatar with link to channel page */}
                                <Link to={`/channel/${value.channelId}`}>
                                    <div className="w-7 shrink-0 transition-transform duration-300 ease-in-out hover:rotate-360">
                                        <img src={channels[value.channelId].avatar} className="rounded-full" alt="" />
                                    </div>
                                </Link>

                                {/* Video metadata with channel name link */}
                                <div className="px-3 text-[#aaa] overflow-hidden">
                                    <h3 className="text-slate-100 font-medium leading-5 line-clamp-2">{value.title}</h3>
                                    <Link to={`/channel/${value.channelId}`}>
                                        <div className="mt-1 text-sm hover:text-slate-100">{value.channelName}</div>
                                    </Link>
                                    <div className="mt-1 text-xs">{videoUtils.formatViewsCount(value.views)} views • {videoUtils.getRelativeUploadTime(value.uploadDate)}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Home