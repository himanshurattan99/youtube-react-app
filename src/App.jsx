import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home.jsx'
import Channel from './Pages/Channel.jsx'

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarMode, setSidebarMode] = useState('contract')

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <>
      <Navbar onMenuClick={toggleSidebar} />

      <main className="flex bg-[#181818] relative">
        <Sidebar isExpanded={sidebarExpanded} sidebarMode={sidebarMode} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/explore/:category' element={<Home />} />
          <Route path='/subscriptions' element={<Home />} />
          <Route path='/:channelId' element={<Channel />} />
        </Routes>
      </main>
    </>
  )
}

export default App