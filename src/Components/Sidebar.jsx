import { useState, useEffect } from 'react'
import { db } from '../data/db.js'
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
  const [subscribedChannels, setSubscribedChannels] = useState({})

  useEffect(() => {
    const userSubscriptions = db.users["helloworld"].subscriptions

    const filteredChannels = {}
    userSubscriptions.forEach((channelId) => {
      if (db.channels[channelId]) {
        filteredChannels[channelId] = db.channels[channelId]
      }
    })

    setSubscribedChannels(filteredChannels)
  }, [])

  const isSlidingMode = (sidebarMode === 'slide')
  const isLabelVisible = (isExpanded || isSlidingMode)

  return (
    <>
      <div className={`h-[92.5vh] px-5 bg-[#181818] text-slate-100 overflow-y-auto scrollbar-thin-gray transition-transform duration-250 ${(isSlidingMode && !isExpanded) ? '-translate-x-full absolute z-10' : ''}`}>
        <div className="py-3 border-b border-b-[#3d3d3d]">
          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={home_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Home</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={subscriptions_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Subscriptions</span>}
          </button>
        </div>

        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className={`p-2 text-lg font-medium`}>Explore</h2>}

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={music_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Music</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={movies_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Movies</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={gaming_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Gaming</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={sports_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Sports</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={science_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Science</span>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={tech_icon} className="w-6" alt="" />
            {(isLabelVisible) && <span>Technology</span>}
          </button>
        </div>

        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className="p-2 text-lg font-medium">Subscriptions</h2>}

          {Object.entries(subscribedChannels).map(([key, value]) => {
            return (
              <button key={key} className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
                <img src={value.avatar} className="w-6 rounded-full" alt="" />
                {(isLabelVisible) && <span>{value.name}</span>}
              </button>
            )
          })}
        </div>

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