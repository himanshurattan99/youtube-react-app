import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { useParams } from 'react-router-dom'
import * as videoUtils from '../utils/utils.js'
import youtube_logo from '../assets/logos/youtube-logo.svg'
import like_icon from '../assets/icons/like-icon.png'
import dislike_icon from '../assets/icons/dislike-icon.png'
import share_icon from '../assets/icons/share-icon.png'
import save_icon from '../assets/icons/save-icon.png'

const Video = ({ deviceType = 'desktop' }) => {
    // State for video and channel data
    const [video, setVideo] = useState({})
    const [channel, setChannel] = useState({})
    // State for recommended videos
    const [recommendedVideos, setRecommendedVideos] = useState({})

    // Get video ID from URL params
    const { videoId } = useParams()
    // Check if current device is mobile
    const isMobileDevice = (deviceType === 'mobile')

    // Load video and channel data when component mounts or videoId changes
    useEffect(() => {
        // Get video data by ID
        const videoData = db.videos[videoId]
        setVideo(videoData)

        // Get channel data using the video's channel ID
        const channelData = db.channels[videoData.channelId]
        setChannel(channelData)

        // Generate random recommended videos
        const randomVideos = videoUtils.getRandomVideos(db.videos)
        setRecommendedVideos(randomVideos)
    }, [videoId])

    return (
        <div className="h-[92.5vh] p-3 lg:py-6 lg:pr-6 lg:pl-24 bg-[#181818] text-slate-100 flex-1 flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-0 overflow-y-auto scrollbar-thin-gray">
            {/* Main video content container */}
            <div className="lg:w-[64%] flex flex-col gap-2 sm:gap-3">
                {/* Video thumbnail with play button overlay */}
                <div className="-mx-3 lg:mx-0 aspect-video relative">
                    <img src={video.thumbnail} className="w-full aspect-video lg:rounded-xl" alt="" />
                    <div className="bg-black/50 lg:rounded-xl absolute inset-0">
                        <img src={youtube_logo} className="w-1/10 sm:w-1/12 lg:w-1/16 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:rotate-360" alt="" />
                    </div>
                </div>

                {/* Video title */}
                <h2 className="text-lg sm:text-xl font-medium">{video.title}</h2>

                {/* Channel info and action buttons row */}
                <div className="lg:text-sm flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    {/* Channel info and subscribe button */}
                    <div className="flex items-center gap-2">
                        {/* Channel avatar */}
                        <div className="w-7 sm:w-10 shrink-0 cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-360">
                            <img src={channel.avatar} className="rounded-full" alt="" />
                        </div>

                        {/* Channel name and subscriber count */}
                        <div className="me-3 flex sm:block items-center gap-2">
                            <div className="sm:text-base font-medium">{channel.name}</div>
                            <div className="sm:text-sm lg:text-xs text-[#aaa]">
                                {videoUtils.formatSubscribersCount(channel.subscribers)} {(isMobileDevice) ? '' : 'subscribers'}
                            </div>
                        </div>

                        {/* Subscribe button */}
                        <button className="ml-auto sm:ml-0 py-1 sm:py-2 px-3 bg-slate-100 hover:bg-slate-100/80 rounded-3xl text-[#181818] font-medium cursor-pointer">
                            Subscribe
                        </button>
                    </div>

                    {/* Video action buttons */}
                    <div className="text-sm sm:text-base flex items-center gap-2">
                        {/* Like/Dislike buttons */}
                        <div className="bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium flex overflow-hidden">
                            <button className="py-1 sm:py-2 px-3 hover:bg-[#3c3c3c] flex items-center gap-1 cursor-pointer">
                                <img src={like_icon} className="w-5 sm:w-6" alt="" />
                                <span>{videoUtils.formatViewsCount(video.likes)}</span>
                            </button>

                            <span className="border-l border-[#3c3c3c]"></span>

                            <button className="py-1 sm:py-2 px-3 hover:bg-[#3c3c3c] cursor-pointer">
                                <img src={dislike_icon} className="w-5 sm:w-6" alt="" />
                            </button>
                        </div>

                        {/* Share button */}
                        <button className="py-1 sm:py-2 px-3 bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium hover:bg-[#3c3c3c] flex items-center gap-1 cursor-pointer">
                            <img src={share_icon} className="w-5 sm:w-6" alt="" />
                            <span>Share</span>
                        </button>

                        {/* Save button */}
                        <button className="py-1 sm:py-2 px-3 bg-[#2e2e2e] rounded-3xl text-slate-100 font-medium hover:bg-[#3c3c3c] flex items-center gap-1 cursor-pointer">
                            <img src={save_icon} className="w-5 sm:w-6" alt="" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>

                {/* Video description box */}
                <div className="mt-1 sm:mt-0 p-3 bg-[#2e2e2e] rounded-lg text-sm sm:text-base lg:text-sm text-slate-100">
                    {/* Video stats */}
                    <div className="font-medium flex gap-2">
                        <div>{videoUtils.formatViewsCount(video.views)} views</div>
                        <div>Premiered {video.uploadDate}</div>
                    </div>

                    {/* Video description */}
                    <div className="text-justify">
                        {video.description}
                    </div>
                </div>
            </div>

            {/* Recommended videos section */}
            <div className="lg:w-[31%] flex flex-col gap-3">
                {Object.entries(recommendedVideos).map(([key, value]) => {
                    return (
                        <div key={key} className="hover:bg-[#1e1e1e] rounded-lg flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 cursor-pointer">
                            {/* Video thumbnail with duration overlay */}
                            <div className="sm:w-[35%] lg:w-[45%] aspect-video relative transition-transform hover:scale-105">
                                <img src={value.thumbnail} className="w-full aspect-video object-cover rounded-lg" alt="" />
                                <span className="px-1 bg-black opacity-75 rounded text-sm lg:text-xs text-white absolute bottom-1 right-1">
                                    {videoUtils.formatDuration(value.duration)}
                                </span>
                            </div>

                            {/* Video metadata */}
                            <div className="flex-1">
                                <h3 className="sm:w-[90%] mb-0.5 sm:mb-2 lg:mb-1 lg:text-sm font-medium line-clamp-2">{value.title}</h3>
                                {!(isMobileDevice) &&
                                    <div className="sm:w-[90%] mb-1 lg:mb-0.5 text-sm lg:text-xs text-[#aaa] hover:text-slate-100 line-clamp-1">
                                        {value.channelName}
                                    </div>
                                }
                                <div className="text-sm lg:text-xs text-[#aaa] line-clamp-1">
                                    {(isMobileDevice) ? `${value.channelName} •` : ''} {videoUtils.formatViewsCount(value.views)} views • {videoUtils.getRelativeUploadTime(value.uploadDate)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Video