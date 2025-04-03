import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams, useLocation, Link } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'

const Home = () => {
    const [videos, setVideos] = useState({})
    const [channels, setChannels] = useState({})
    const { category } = useParams()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname === '/subscriptions') {
            const userSubscriptions = db.users["helloworld"].subscriptions

            const videoIds = userSubscriptions.flatMap((element) => {
                return db.channels[element].videos
            })

            const sortedSubscriptionVideos = Object.fromEntries(
                videoIds.map((videoId) => [videoId, db.videos[videoId]])
                    .sort(([, valueA], [, valueB]) =>
                        new Date(valueB.uploadDate) - new Date(valueA.uploadDate)
                    )
            )
            setVideos(sortedSubscriptionVideos)
        } else if (!(category)) {
            setVideos(videoUtils.getRandomVideos(db.videos))
        } else {
            const filteredVideos = Object.fromEntries(
                Object.entries(db.videos).filter(([_, video]) => {
                    return video.category.toLowerCase() === category
                })
            )
            setVideos(videoUtils.getRandomVideos(filteredVideos))
        }

        setChannels(db.channels)
    }, [location])

    return (
        <div className="h-[92.5vh] p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto scrollbar-thin-gray">
            <h2 className="mb-6 text-xl font-bold">
                {(!(category) && location.pathname !== '/subscriptions') ?
                    'Recommended'
                    : (category) ?
                        videoUtils.capitalize(category) : 'Subscriptions'
                }
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-3">
                {Object.entries(videos).map(([key, value]) => {
                    return (
                        <div key={key} className="hover:bg-[#1e1e1e] rounded-lg cursor-pointer overflow-hidden transition-all hover:scale-105">
                            <div className="relative">
                                <img src={value.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {videoUtils.formatDuration(value.duration)}
                                </span>
                            </div>

                            <div className="py-3 flex">
                                <Link to={`/${value.channelId}`}>
                                    <div className="w-7 shrink-0 transition-transform duration-300 ease-in-out hover:rotate-360">
                                        <img src={channels[value.channelId].avatar} className="rounded-full" alt="" />
                                    </div>
                                </Link>

                                <div className="px-3 text-[#aaa] overflow-hidden">
                                    <h3 className="text-slate-100 font-medium leading-5 line-clamp-2">{value.title}</h3>
                                    <Link to={`/${value.channelId}`}>
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