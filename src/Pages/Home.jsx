import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams, useLocation } from 'react-router-dom'
import { formatDuration, formatViews, getRelativeUploadTime, getRandomVideos } from '../utils/utils.js'

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
            setVideos(getRandomVideos(db.videos))
        } else {
            const filteredVideos = Object.fromEntries(
                Object.entries(db.videos).filter(([_, video]) => {
                    return video.category.toLowerCase() === category
                })
            )
            setVideos(getRandomVideos(filteredVideos))
        }

        setChannels(db.channels)
    }, [location])

    return (
        <div className={`h-[92.5vh] p-6 bg-[#181818] text-slate-100 flex-1 overflow-y-auto scrollbar-thin-gray`}>
            <h2 className="mb-6 text-xl font-bold">Recommended</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-3">
                {Object.entries(videos).map(([key, value]) => {
                    return (
                        <div key={key} className="hover:bg-[#1e1e1e] rounded-lg cursor-pointer overflow-hidden transition-all hover:scale-105">
                            <div className="relative">
                                <img src={value.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                <span className="px-1 bg-black opacity-75 rounded text-xs text-white absolute bottom-1 right-1">
                                    {formatDuration(value.duration)}
                                </span>
                            </div>

                            <div className="py-3 flex">
                                <div className="w-7 shrink-0">
                                    <img src={channels[value.channelId].avatar} className="rounded-full" alt="" />
                                </div>

                                <div className="px-3 overflow-hidden">
                                    <h3 className="font-medium truncate">{value.title}</h3>
                                    <div className="mt-1 text-sm text-[#aaa]">{value.channelName}</div>
                                    <div className="mt-1 text-xs text-[#aaa]">{formatViews(value.views)} views • {getRelativeUploadTime(value.uploadDate)}</div>
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