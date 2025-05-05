import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home.jsx'
import Channel from './Pages/Channel.jsx'
import Search from './Pages/Search.jsx'

function App() {
  // State for sidebar expansion (expanded/collapsed), display mode (contract or slide) and tracking current device type
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarMode, setSidebarMode] = useState('contract')
  const [deviceType, setDeviceType] = useState('')

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

  return (
    <>
      <Navbar onMenuClick={toggleSidebar} />

      <main className="flex bg-[#181818] relative">
        <Sidebar isExpanded={sidebarExpanded} sidebarMode={sidebarMode} deviceType={deviceType} />

        <Routes>
          <Route path='/' element={<Home sidebarExpanded={sidebarExpanded} />} />
          <Route path='/explore/:category' element={<Home sidebarExpanded={sidebarExpanded} />} />
          <Route path='/subscriptions' element={<Home sidebarExpanded={sidebarExpanded} />} />
          <Route path='/:channelId' element={<Channel sidebarExpanded={sidebarExpanded} deviceType={deviceType} />} />
          <Route path='/search/:searchInput' element={<Search sidebarExpanded={sidebarExpanded} />} />
        </Routes>

        {/* Semi-transparent overlay when sidebar is expanded in slide mode */}
        {((sidebarExpanded) && (sidebarMode === 'slide')) &&
          <div className="bg-black opacity-30 absolute inset-0"></div>
        }
      </main>
    </>
  )
}

export default App