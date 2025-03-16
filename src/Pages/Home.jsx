import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { formatDuration, formatViews, getRelativeUploadTime } from '../utils/utils.js'

const Home = () => {
    const [videos, setVideos] = useState({})
    const [channels, setChannels] = useState({})

    useEffect(() => {
        setVideos(db.videos)
        setChannels(db.channels)
    }, [])

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