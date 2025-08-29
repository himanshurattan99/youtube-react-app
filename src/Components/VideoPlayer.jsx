import { useState, useRef, useEffect } from 'react'
import * as videoUtils from '../utils/utils.js'
import play_icon from '../assets/icons/play-icon.png'
import pause_icon from '../assets/icons/pause-icon.png'
import replay_icon from '../assets/icons/replay-icon.png'
import volume_icon from '../assets/icons/volume-icon.png'
import mute_icon from '../assets/icons/mute-icon.png'
import fullscreen_icon from '../assets/icons/fullscreen-icon.png'
import exit_fullscreen_icon from '../assets/icons/exit-fullscreen-icon.png'

const VideoPlayer = () => {
  // Reference to video element
  const videoRef = useRef(null)
  // State for play/pause functionality
  const [isPlaying, setIsPlaying] = useState(true)
  // State to track if video has ended
  const [hasEnded, setHasEnded] = useState(false)
  // State for video duration and current playback time
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  // State for volume control
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  // State for UI visibility
  const [showControls, setShowControls] = useState(false)
  // State for brief icon display when clicking video
  const [showClickIcon, setShowClickIcon] = useState(false)

  // Reference to container for fullscreen functionality
  const containerRef = useRef(null)
  // State to track fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Toggle play/pause state
  const togglePlay = () => {
    setIsPlaying(!(isPlaying))

    // Show click icon briefly
    setShowClickIcon(true)
    setTimeout(() => setShowClickIcon(false), 500)
  }

  // Replay video from the beginning
  const replayVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setCurrentTime(0)
    setHasEnded(false)
    setIsPlaying(true)

    // Show click icon briefly
    setShowClickIcon(true)
    setTimeout(() => setShowClickIcon(false), 500)
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

    // Check if video has ended by seeking to the end
    if (newCurrentTime >= duration) {
      setHasEnded(true)
      setIsPlaying(false)
    }
    // Reset ended state if seeking away from end
    else {
      setHasEnded(false)
    }
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

  // Handle keyboard shortcuts for video playback controls
  const handleVideoKeyDown = (e) => {
    const video = videoRef.current
    if (!video) return

    // Seek to a new time position within video bounds
    const seek = (offset) => {
      const newCurrentTime = Math.min(duration, Math.max(0, currentTime + offset))
      video.currentTime = newCurrentTime
      setCurrentTime(newCurrentTime)

      // Check if video has ended by seeking to the end
      if (newCurrentTime >= duration) {
        setHasEnded(true)
        setIsPlaying(false)
      }
      // Reset ended state if seeking away from end
      else {
        setHasEnded(false)
      }
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault() // Prevent page scroll
        seek(-10) // Seek backward 10 seconds
        break

      case 'ArrowRight':
        e.preventDefault()
        seek(10) // Seek forward 10 seconds
        break

      case ' ': // Space bar for play/pause
        e.preventDefault()
        e.preventDefault()
        if (hasEnded) {
          replayVideo()
        } else {
          togglePlay()
        }
        break
    }
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const container = containerRef.current

    // Enter fullscreen if not already in fullscreen mode
    if (!(document.fullscreenElement)) {
      container.requestFullscreen()
    }
    // Exit fullscreen if already in fullscreen mode
    else {
      document.exitFullscreen()
    }

    setIsFullscreen(!(isFullscreen))
  }

  // Set up video event listeners for duration and time updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Update duration when video metadata loads
    const updateDuration = () => setDuration(video.duration)
    // Update current time during playback
    const updateTime = () => setCurrentTime(video.currentTime)
    // Handle video end event
    const handleVideoEnd = () => {
      setHasEnded(true)
      setIsPlaying(false)
    }
    // Update fullscreen state when fullscreen mode changes
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)

    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('ended', handleVideoEnd)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    // Cleanup event listeners
    return () => {
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('ended', handleVideoEnd)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
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
    <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}
      onKeyDown={handleVideoKeyDown}
      ref={containerRef}
      tabIndex={0}
      className="outline-none relative"
    >
      {/* Video element */}
      <video onClick={(hasEnded) ? replayVideo : togglePlay} src="" ref={videoRef} className="w-full aspect-video" />

      {/* Brief play/pause icon display on video click */}
      {(showClickIcon) && (
        <div className="p-3 bg-black/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping">
          <img src={(isPlaying) ? play_icon : pause_icon}
            className="size-6 animate-pulse" alt="" />
        </div>
      )}

      {/* Video controls overlay */}
      {(showControls) &&
        (
          <div className="absolute right-0 bottom-2 left-0">
            {/* Progress bar */}
            <div className="">
              <input onChange={handleProgressChange} type="range"
                value={currentTime} min="0" max={duration} step={1 / duration}
                className="w-full cursor-pointer media-slider media-slider-red"
                style={{
                  background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
            </div>

            {/* Control buttons and info */}
            <div className="py-1 px-3 flex items-center gap-5">
              {/* Play/Pause button */}
              <button onClick={(hasEnded) ? replayVideo : togglePlay} className="w-6 cursor-pointer transition-transform hover:rotate-360">
                <img src={(hasEnded) ? replay_icon : ((isPlaying) ? pause_icon : play_icon)} alt="" />
              </button>

              {/* Volume control section */}
              <div className="flex items-center gap-1 cursor-pointer">
                {/* Volume/Mute button */}
                <img onClick={toggleIsMuted} src={(isMuted) ? mute_icon : volume_icon} className="w-6" alt="" />

                {/* Volume slider */}
                <input onChange={(e) => handleVolumeChange(e)} type="range"
                  value={(isMuted) ? 0 : volume} min="0" max="1" step="0.025"
                  className="w-18 cursor-pointer media-slider media-slider-white"
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted) ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted) ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                  }}
                />
              </div>

              {/* Current time and duration display */}
              <div className="text-sm">
                {videoUtils.formatTime(Math.floor(currentTime))} / {videoUtils.formatTime(Math.floor(duration))}
              </div>

              {/* Toggle fullscreen button */}
              <button onClick={toggleFullscreen} className="ml-auto cursor-pointer">
                <img src={(isFullscreen) ? exit_fullscreen_icon : fullscreen_icon} className="w-6 transition-transform duration-250 hover:scale-105" alt="" />
              </button>
            </div>
          </div>
        )}
    </div>
  )
}

export default VideoPlayer