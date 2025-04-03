import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'

const Channel = () => {
    const [videos, setVideos] = useState({})
    const [channel, setChannel] = useState("")
    const [videoSort, setVideoSort] = useState("")
    const { channelId } = useParams()
    const userSubscriptions = db.users["helloworld"].subscriptions

    useEffect(() => {
        setChannel(db.channels[channelId])
        setVideoSort("latest")

        const videoIds = db.channels[channelId].videos

        const channelVideos = Object.fromEntries(
            videoIds.map((videoId) => {
                return [videoId, db.videos[videoId]]
            })
        )
        setVideos(channelVideos)
    }, [channelId])

    useEffect(() => {
        if (!videoSort || Object.keys(videos).length === 0) return

        const sortFunctions = {
            "latest": ([, a], [, b]) => new Date(b.uploadDate) - new Date(a.uploadDate),
            "popular": ([, a], [, b]) => b.views - a.views,
            "oldest": ([, a], [, b]) => new Date(a.uploadDate) - new Date(b.uploadDate)
        }

        const sortFunction = sortFunctions[videoSort]
        if (!sortFunction) return

        const sortedVideos = Object.fromEntries(
            Object.entries(videos).sort(sortFunction)
        )
        setVideos(sortedVideos)
    }, [videoSort])

    return (
        <>
            <div className="h-[92.5vh] px-2 text-slate-100 overflow-y-auto scrollbar-thin-gray">
                <div className="py-1 px-24 border-b border-b-[#3d3d3d]">
                    <div>
                        <img className="rounded-2xl" src={channel.banner} alt="" />
                    </div>

                    <div className="mt-7 mb-3 flex">
                        <div className="shrink-0">
                            <img className="rounded-full" src={channel.avatar} alt="" />
                        </div>

                        <div className="px-3 flex flex-col justify-center gap-3">
                            <h1 className="text-4xl font-medium">{channel.name}</h1>

                            <div className="text-[#aaa] flex items-center">
                                <h2 className="text-slate-100 font-medium">@{channelId}</h2>
                                <span className="mx-2">•</span>
                                <div>{videoUtils.formatSubscribersCount(channel.subscribers)} subscribers</div>
                                <span className="mx-2">•</span>
                                <div>{(channel) ? channel.videos.length : ''} videos</div>
                            </div>

                            <button type="button" className={`py-2 px-4 ${userSubscriptions.includes(channelId) ? 'bg-[#2e2e2e] hover:bg-[#3c3c3c]' : 'bg-slate-100 text-[#181818]'} rounded-3xl font-medium self-start cursor-pointer`}>
                                {userSubscriptions.includes(channelId) ?
                                    'Subscribed' : 'Subscribe'
                                }
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-2 px-24">
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

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-3">
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