import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarMode, setSidebarMode] = useState('contract')

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <>
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isExpanded={sidebarExpanded} sidebarMode={sidebarMode} />
    </>
  )
}

export default App