import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home.jsx'
import Channel from './Pages/Channel.jsx'
import Search from './Pages/Search.jsx'
import Video from './Pages/Video.jsx'
import Error from './Pages/Error.jsx'

const App = () => {
  // State for sidebar expansion (expanded/collapsed) and display mode (contract or slide)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarMode, setSidebarMode] = useState('contract')
  // State for tracking current device type
  const [deviceType, setDeviceType] = useState('')
  // States to store videos to persist across navigation (random home feed and categorized videos)
  const [homeVideos, setHomeVideos] = useState({})
  const [categoryVideosCache, setCategoryVideosCache] = useState({})

  // Get current location to detect route changes
  const location = useLocation()
  // Check if current route is a video watch page
  const isVideoPage = location.pathname.startsWith('/watch')

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Get the device type based on current window width
  const getDeviceType = () => {
    const windowWidth = window.innerWidth

    if (windowWidth < 768) {
      return 'mobile'
    }
    else if (windowWidth >= 768 && windowWidth < 1024) {
      return 'tablet'
    }
    else {
      return 'desktop'
    }
  }

  // Update sidebar configuration when window size changes
  const handleResize = () => {
    const newDeviceType = getDeviceType()
    setDeviceType(newDeviceType)

    // Don't update sidebar on resize if we're on a video page
    if (isVideoPage) return

    if (newDeviceType === 'desktop') {
      setSidebarExpanded(true)
      setSidebarMode('contract')
    }
    else if (newDeviceType === 'tablet') {
      setSidebarExpanded(false)
      setSidebarMode('contract')
    }
    else {
      setSidebarExpanded(false)
      setSidebarMode('slide')
    }
  }

  // Handle responsive layout changes based on device type
  useEffect(() => {
    // Set initial sidebar states based on current screen size
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle route changes to update sidebar state
  useEffect(() => {
    // Always use slide mode and collapse sidebar on video pages
    if (isVideoPage) {
      setSidebarExpanded(false)
      setSidebarMode('slide')
    }
    // Reset sidebar state based on device type for other pages
    else {
      handleResize()
    }
  }, [location.pathname])

  return (
    <>
      <Navbar onMenuClick={toggleSidebar} />

      <main className="flex bg-[#181818] relative">
        <Sidebar isExpanded={sidebarExpanded} sidebarMode={sidebarMode} deviceType={deviceType} />

        <Routes>
          <Route path='/' element={<Home homeVideos={homeVideos} setHomeVideos={setHomeVideos} sidebarExpanded={sidebarExpanded} />} />
          <Route path='/subscriptions' element={<Home sidebarExpanded={sidebarExpanded} />} />
          <Route path='/explore' element={<Home categoryVideosCache={categoryVideosCache} setCategoryVideosCache={setCategoryVideosCache} sidebarExpanded={sidebarExpanded} />} />
          <Route path='/channel' element={<Error errorCode='400' errorMessage='Hey! Tell us which channel you want to visit!' />} />
          <Route path='/channel/:channelId' element={<Channel sidebarExpanded={sidebarExpanded} deviceType={deviceType} />} />
          <Route path='/search' element={<Search sidebarExpanded={sidebarExpanded} deviceType={deviceType} />} />
          <Route path='/watch' element={<Video deviceType={deviceType} />} />
          <Route path='*' element={<Error errorCode='404' errorMessage="Hmm, this page doesn't exist. Looks like you took a wrong turn!" />} />
        </Routes>

        {/* Semi-transparent overlay when sidebar is expanded in slide mode */}
        {((sidebarExpanded) && (sidebarMode === 'slide')) &&
          <div onClick={() => setSidebarExpanded(false)} className="bg-black opacity-30 absolute inset-0"></div>
        }
      </main>
    </>
  )
}

export default App