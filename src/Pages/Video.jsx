import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'
import youtube_logo from '../assets/logos/youtube-logo.svg'
import like_icon from '../assets/icons/like-icon.png'
import dislike_icon from '../assets/icons/dislike-icon.png'
import share_icon from '../assets/icons/share-icon.png'
import save_icon from '../assets/icons/save-icon.png'

const Video = () => {
    // State for video and channel data
    const [video, setVideo] = useState({})
    const [channel, setChannel] = useState({})

    // Get video ID from URL params
    const { videoId } = useParams()

    // Load video and channel data when component mounts or videoId changes
    useEffect(() => {
        // Get video data by ID
        const videoData = db.videos[videoId]
        setVideo(videoData)

        // Get channel data using the video's channel ID
        const channelData = db.channels[videoData.channelId]
        setChannel(channelData)
    }, [videoId])

    return (
        <div className="h-[92.5vh] p-3 lg:py-6 lg:px-24 bg-[#181818] text-slate-100 flex-1 overflow-y-auto scrollbar-thin-gray">
            {/* Main video content container */}
            <div className="w-3/5 flex flex-col gap-3">
                {/* Video thumbnail with play button overlay */}
                <div className="bg-gray-950 rounded-lg relative overflow-hidden">
                    <img src={video.thumbnail} className="" alt="" />
                    <div className="bg-black/50 absolute inset-0">
                        <img src={youtube_logo} className="w-1/16 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:rotate-360" alt="" />
                    </div>
                </div>

                {/* Video title */}
                <h2 className="text-xl font-medium">{video.title}</h2>

                {/* Channel info and action buttons row */}
                <div className="flex justify-between items-center">
                    {/* Channel info and subscribe button */}
                    <div className="flex items-center gap-2">
                        {/* Channel avatar */}
                        <div className="w-10 shrink-0 cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-360">
                            <img src={channel.avatar} className="rounded-full" alt="" />
                        </div>

                        {/* Channel name and subscriber count */}
                        <div className="me-3">
                            <div className="font-medium">{channel.name}</div>
                            <div className="text-xs text-[#aaa]">
                                {videoUtils.formatSubscribersCount(channel.subscribers)} subscribers
                            </div>
                        </div>

                        {/* Subscribe button */}
                        <button className="py-2 px-3 bg-slate-100 hover:bg-slate-100/80 rounded-3xl text-[#181818] font-medium cursor-pointer">
                            Subscribe
                        </button>
                    </div>

                    {/* Video action buttons */}
                    <div className="flex items-center gap-2">
                        {/* Like/Dislike buttons */}
                        <div className="bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium flex overflow-hidden">
                            <button className="py-2 px-3 hover:bg-[#3c3c3c] flex gap-1 cursor-pointer">
                                <img src={like_icon} className="w-6" alt="" />
                                <span>{videoUtils.formatViewsCount(video.likes)}</span>
                            </button>

                            <span className="border-l border-[#3c3c3c]"></span>

                            <button className="py-2 px-3 hover:bg-[#3c3c3c] cursor-pointer">
                                <img src={dislike_icon} className="w-6" alt="" />
                            </button>
                        </div>

                        {/* Share button */}
                        <button className="py-2 px-3 bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium hover:bg-[#3c3c3c] flex gap-1 cursor-pointer">
                            <img src={share_icon} className="w-6" alt="" />
                            <span>Share</span>
                        </button>

                        {/* Save button */}
                        <button className="py-2 px-3 bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium hover:bg-[#3c3c3c] flex gap-1 cursor-pointer">
                            <img src={save_icon} className="w-6" alt="" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>

                {/* Video description box */}
                <div className="p-3 bg-[#2e2e2e] rounded-lg text-slate-100">
                    {/* Video stats */}
                    <div className="flex gap-2">
                        <div>{videoUtils.formatViewsCount(video.views)} views</div>
                        <div>Premiered {video.uploadDate}</div>
                    </div>

                    {/* Video description */}
                    <div className="text-justify">
                        {video.description}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video