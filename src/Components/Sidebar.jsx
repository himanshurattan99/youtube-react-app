import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { Link } from 'react-router-dom'
import home_icon from '../assets/icons/home-icon.png'
import subscriptions_icon from '../assets/icons/subscriptions-icon.png'
import expand_icon from '../assets/icons/expand-icon.png'
import collapse_icon from '../assets/icons/collapse-icon.png'
import music_icon from '../assets/icons/music-icon.png'
import movies_icon from '../assets/icons/movies-icon.png'
import gaming_icon from '../assets/icons/gaming-icon.png'
import sports_icon from '../assets/icons/sports-icon.png'
import science_icon from '../assets/icons/science-icon.png'
import tech_icon from '../assets/icons/tech-icon.png'
import settings_icon from '../assets/icons/settings-icon.png'

const Sidebar = ({ isExpanded = true, sidebarMode = 'contract', deviceType = 'desktop' }) => {
  // State to store user's subscribed channels data
  const [subscribedChannels, setSubscribedChannels] = useState({})
  // State to toggle between showing first 5 or all subscribed channels
  const [showAllChannels, setShowAllChannels] = useState(false)
  // State to store subscribed channels currently displayed in sidebar
  const [channelsToDisplay, setChannelsToDisplay] = useState({})

  // Toggle between showing all subscribed channels or just the first 5
  const toggleShowAllChannels = () => {
    setShowAllChannels(!showAllChannels)
  }

  // Load user subscriptions from database on component mount
  useEffect(() => {
    // Get user's subscription list
    const userSubscribedChannels = db.users["helloworld"].subscribedChannels

    // Filter to include only user's subscribed channels
    const filteredChannels = {}
    userSubscribedChannels.forEach((channelId) => {
      if (db.channels[channelId]) {
        filteredChannels[channelId] = db.channels[channelId]
      }
    })
    setSubscribedChannels(filteredChannels)
    setChannelsToDisplay(Object.fromEntries(Object.entries(filteredChannels).slice(0, 5)))
  }, [])

  // Update displayed channels when showAllChannels state changes
  useEffect(() => {
    if (Object.keys(subscribedChannels).length === 0) return

    // Display all channels or limit to first 5 based on toggle state
    setChannelsToDisplay((showAllChannels) ?
      subscribedChannels
      : Object.fromEntries(Object.entries(subscribedChannels).slice(0, 5))
    )
  }, [showAllChannels])

  // Determine sidebar visual behavior
  const isSlidingMode = (sidebarMode === 'slide')
  // Show labels when sidebar is expanded or in sliding mode
  const isLabelVisible = (isExpanded || isSlidingMode)
  // Check if current device is mobile
  const isMobileDevice = (deviceType === 'mobile')

  // Define 'Explore' section items
  const exploreItems = [
    { label: 'Music', icon: music_icon },
    { label: 'Movies', icon: movies_icon },
    { label: 'Gaming', icon: gaming_icon },
    { label: 'Sports', icon: sports_icon },
    { label: 'Science', icon: science_icon },
    { label: 'Technology', icon: tech_icon }
  ]

  return (
    <>
      <div className={`h-[92.5vh] ${(isLabelVisible) ? 'md:w-[27%] lg:w-[16%]' : ''} ${(isMobileDevice) ? 'px-3' : 'px-5'} bg-[#181818] text-slate-100 shrink-0 overflow-y-auto scrollbar-thin-gray transition-transform duration-250 ${(isSlidingMode && !isExpanded) ? '-translate-x-full' : ''} ${(isSlidingMode) ? 'absolute z-10' : ''}`}>
        {/* Home and Subscriptions section */}
        <div className="py-3 border-b border-b-[#3d3d3d]">
          <Link to={`/`}>
            <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
              <img src={home_icon} className="w-6" alt="" />
              {(isLabelVisible) && <span className="truncate">Home</span>}
            </button>
          </Link>

          <Link to={`/subscriptions`}>
            <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
              <img src={subscriptions_icon} className="w-6" alt="" />
              {(isLabelVisible) && <span className="truncate">Subscriptions</span>}
            </button>
          </Link>
        </div>

        {/* Explore section */}
        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className={`p-2 text-lg font-medium`}>Explore</h2>}

          {exploreItems.map(({ label, icon }, index) => {
            return (
              <Link key={label.toLowerCase()} to={`/explore/${label.toLowerCase()}`}>
                <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
                  <img src={icon} className="w-6" alt="" />
                  {(isLabelVisible) && <span className="truncate">{label}</span>}
                </button>
              </Link>
            )
          })}
        </div>

        {/* User's Subscribed Channels section */}
        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className="p-2 text-lg font-medium">Subscriptions</h2>}

          {Object.entries(channelsToDisplay).map(([key, value]) => {
            return (
              <Link key={key} to={`/channel/${key}`}>
                <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
                  <img src={value.avatar} className="w-6 rounded-full" alt="" />
                  {(isLabelVisible) && <span className="truncate">{value.name}</span>}
                </button>
              </Link>
            )
          })}

          <button onClick={toggleShowAllChannels} className="group w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={(showAllChannels) ? collapse_icon : expand_icon} className="w-6 rounded-full transition-transform duration-300 ease-in-out group-hover:rotate-360" alt="" />
            {(isLabelVisible) && <span className="truncate">{(showAllChannels) ? 'Show Less' : 'Show More'}</span>}
          </button>
        </div>

        {/* Settings section */}
        <div className="py-3">
          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={settings_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span className="truncate">Settings</span>}
          </button>
        </div>
      </div >
    </>
  )
}

export default Sidebar