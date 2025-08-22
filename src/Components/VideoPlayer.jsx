import { useState, useRef, useEffect } from 'react'
import * as videoUtils from '../utils/utils.js'
import play_icon from '../assets/icons/play-icon.png'
import pause_icon from '../assets/icons/pause-icon.png'
import volume_icon from '../assets/icons/volume-icon.png'
import mute_icon from '../assets/icons/mute-icon.png'

const VideoPlayer = () => {
  // Reference to video element
  const videoRef = useRef(null)
  // State for play/pause functionality
  const [isPlaying, setIsPlaying] = useState(true)
  // State for video duration and current playback time
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  // State for volume control
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  // State for UI visibility
  const [showControls, setShowControls] = useState(false)

  // Toggle play/pause state
  const togglePlay = () => {
    setIsPlaying(!(isPlaying))
  }

  // Toggle mute/unmute state
  const toggleIsMuted = () => {
    setIsMuted(!(isMuted))
  }

  // Handle progress bar changes (seeking)
  const handleProgressChange = (e) => {
    const video = videoRef.current
    if (!video) return

    const newCurrentTime = parseFloat(e.target.value)
    video.currentTime = newCurrentTime
    setCurrentTime(newCurrentTime)
  }

  // Handle volume slider changes
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)

    // Auto-mute when slider reaches 0
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true)
    }

    // Auto-unmute when slider moves away from 0
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  // Set up video event listeners for duration and time updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Update duration when video metadata loads
    const updateDuration = () => setDuration(video.duration)
    // Update current time during playback
    const updateTime = () => setCurrentTime(video.currentTime)

    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('timeupdate', updateTime)

    // Cleanup event listeners
    return () => {
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  // Handle play/pause video based on state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play()
    } else {
      video.pause()
    }
  }, [isPlaying])

  // Update video volume based on volume and mute state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  return (
    <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)} className="relative">
      {/* Video element */}
      <video onClick={togglePlay} src="" ref={videoRef} className="w-full aspect-video" />

      {/* Video controls overlay */}
      {(showControls) &&
        (
          <div className="absolute right-0 bottom-2 left-0">
            {/* Progress bar */}
            <div className="">
              <input onChange={handleProgressChange} type="range"
                value={currentTime} min="0" max={duration} step={1 / duration}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Control buttons and info */}
            <div className="px-3 flex items-center gap-5">
              {/* Play/Pause button */}
              <button onClick={togglePlay} className="w-6 cursor-pointer transition-transform hover:rotate-360">
                <img src={(isPlaying) ? pause_icon : play_icon} alt="" />
              </button>

              {/* Volume control section */}
              <div className="flex gap-1 cursor-pointer">
                {/* Volume/Mute button */}
                <img onClick={toggleIsMuted} src={(isMuted) ? mute_icon : volume_icon} className="w-6" alt="" />

                {/* Volume slider */}
                <input onChange={(e) => handleVolumeChange(e)} type="range"
                  value={(isMuted) ? 0 : volume} min="0" max="1" step="0.025"
                  className="cursor-pointer"
                />
              </div>

              {/* Current time and duration display */}
              <div className="text-sm">
                {videoUtils.formatTime(Math.floor(currentTime))} / {videoUtils.formatTime(Math.floor(duration))}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default VideoPlayer