import { useState, useEffect } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'
import Error from './Error.jsx'

const Home = ({ homeVideos = {}, setHomeVideos, categoryVideosCache = {}, setCategoryVideosCache, sidebarExpanded = true }) => {
    // State for videos
    const [videos, setVideos] = useState({})

    // Extract category from URL query parameters and current location from router state
    const [searchParams] = useSearchParams()
    const category = searchParams.get('category')
    const location = useLocation()

    // Show Error page when explore route has no category parameter
    if ((location.pathname === '/explore') && !(category)) {
        return (
            <Error errorCode='400' errorMessage='Oops! Which category do you want to explore?' />
        )
    }

    // Load videos based on current route
    useEffect(() => {
        // Home page: Display random video recommendations
        if (location.pathname === '/') {
            // Generate new random videos or use cached ones
            if (Object.entries(homeVideos).length === 0) {
                const randomVideos = videoUtils.getRandomVideos()
                setVideos(randomVideos)
                setHomeVideos(randomVideos)
            }
            else {
                setVideos(homeVideos)
            }
        }
        // Subscription feed: Get videos from user's subscribed channels
        else if (location.pathname === '/subscriptions') {
            const sortedSubscriptionVideos = videoUtils.getSubscriptionVideos()
            setVideos(sortedSubscriptionVideos)
        }
        // Category page: Filter videos by selected category
        else if (category) {
            // Fetch new category videos or use cached ones
            if (!categoryVideosCache[category] || Object.entries(categoryVideosCache[category]).length === 0) {
                const categoryVideos = videoUtils.getCategoryVideos({ category })
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
                                <Link to={`/watch?v=${key}`}>
                                    <img src={value.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                    <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                        {videoUtils.formatDuration(value.duration)}
                                    </span>
                                </Link>
                            </div>

                            <div className="py-3 flex">
                                {/* Channel avatar */}
                                <Link to={`/channel/${value.channelId}`}>
                                    <div className="w-7 shrink-0 transition-transform duration-300 ease-in-out hover:rotate-360">
                                        <img src={videoUtils.getChannelAvatar(value.channelId)} className="rounded-full" alt="" />
                                    </div>
                                </Link>

                                {/* Video metadata */}
                                <div className="px-3 text-[#aaa] overflow-hidden">
                                    <Link to={`/watch?v=${key}`}>
                                        <h3 className="text-slate-100 font-medium leading-5 line-clamp-2">{value.title}</h3>
                                    </Link>
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
        </div>
    )
}

export default Home