import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
import { Link } from 'react-router-dom'
import home_icon from '../assets/icons/home-icon.png'
import subscriptions_icon from '../assets/icons/subscriptions-icon.png'
import music_icon from '../assets/icons/music-icon.png'
import movies_icon from '../assets/icons/movies-icon.png'
import gaming_icon from '../assets/icons/gaming-icon.png'
import sports_icon from '../assets/icons/sports-icon.png'
import science_icon from '../assets/icons/science-icon.png'
import tech_icon from '../assets/icons/tech-icon.png'
import settings_icon from '../assets/icons/settings-icon.png'

const Sidebar = ({ isExpanded = true, sidebarMode = 'contract' }) => {
  // State to store user's subscribed channels date
  const [subscribedChannels, setSubscribedChannels] = useState({})

  // Load user subscriptions from database on component mount
  useEffect(() => {
    // Get user's subscription list
    const userSubscriptions = db.users["helloworld"].subscriptions

    // Filter to include only user's subscribed channels
    const filteredChannels = {}
    userSubscriptions.forEach((channelId) => {
      if (db.channels[channelId]) {
        filteredChannels[channelId] = db.channels[channelId]
      }
    })

    setSubscribedChannels(filteredChannels)
  }, [])

  // Determine sidebar visual behavior
  const isSlidingMode = (sidebarMode === 'slide')
  // Show labels when sidebar is expanded or in sliding mode
  const isLabelVisible = (isExpanded || isSlidingMode)

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
      <div className={`h-[92.5vh] px-5 bg-[#181818] text-slate-100 shrink-0 overflow-y-auto scrollbar-thin-gray transition-transform duration-250 ${(isSlidingMode && !isExpanded) ? '-translate-x-full absolute z-10' : ''}`}>
        {/* Home and Subscriptions section */}
        <div className="py-3 border-b border-b-[#3d3d3d]">
          <Link to={`/`}>
            <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
              <img src={home_icon} className="w-6" alt="" />
              {(isLabelVisible) && <span>Home</span>}
            </button>
          </Link>

          <Link to={`/subscriptions`}>
            <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
              <img src={subscriptions_icon} className="w-6" alt="" />
              {(isLabelVisible) && <span>Subscriptions</span>}
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
                  {(isLabelVisible) && <span>{label}</span>}
                </button>
              </Link>
            )
          })}
        </div>

        {/* User's Subscribed Channels section */}
        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className="p-2 text-lg font-medium">Subscriptions</h2>}

          {Object.entries(subscribedChannels).map(([key, value]) => {
            return (
              <Link key={key} to={`/${key}`}>
                <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
                  <img src={value.avatar} className="w-6 rounded-full" alt="" />
                  {(isLabelVisible) && <span>{value.name}</span>}
                </button>
              </Link>
            )
          })}
        </div>

        {/* Settings section */}
        <div className="py-3">
          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={settings_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Settings</span>}
          </button>
        </div>
      </div >
    </>
  )
}

export default Sidebar