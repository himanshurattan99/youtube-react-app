import home_icon from '../assets/home-icon.png'
import subscriptions_icon from '../assets/subscriptions-icon.png'
import music_icon from '../assets/music-icon.png'
import movies_icon from '../assets/movies-icon.png'
import gaming_icon from '../assets/gaming-icon.png'
import sports_icon from '../assets/sports-icon.png'
import science_icon from '../assets/science-icon.png'
import tech_icon from '../assets/tech-icon.png'
import settings_icon from '../assets/settings-icon.png'
import threeBlue1Brown_profile_image from '../assets/3Blue1Brown-profile-image.jpg'
import Jazza_profile_image from '../assets/Jazza-profile-image.jpg'
import MarquesBrownlee_profile_image from '../assets/MarquesBrownlee-profile-image.jpg'
import Mrwhosetheboss_profile_image from '../assets/Mrwhosetheboss-profile-image.jpg'
import TheOdd1sOut_profile_image from '../assets/TheOdd1sOut-profile-image.jpg'
import Veritasium_profile_image from '../assets/Veritasium-profile-image.jpg'

const Sidebar = ({ isExpanded = true, sidebarMode = 'contract' }) => {
  const isSlidingMode = (sidebarMode === 'slide')
  const isLabelVisible = (isExpanded || isSlidingMode)

  return (
    <>
      <div className={`h-[92.5vh] px-5 bg-[#181818] text-slate-100 fixed left-0 overflow-y-auto scrollbar-thin-gray transition-transform duration-250 ${(isSlidingMode) ? ((isExpanded) ? '' : '-translate-x-full') : ''}`}>
        <div className="py-3 border-b border-b-[#3d3d3d]">
          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={home_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Home</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={subscriptions_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Subscriptions</label>}
          </button>
        </div>

        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className={`p-2 text-lg font-medium`}>Explore</h2>}

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={music_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Music</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={movies_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Movies</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={gaming_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Gaming</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={sports_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Sports</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={science_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Science</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={tech_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Technology</label>}
          </button>
        </div>

        <div className="py-3 border-b border-b-[#3d3d3d]">
          {(isLabelVisible) && <h2 className="p-2 text-lg font-medium">Subscriptions</h2>}

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={threeBlue1Brown_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>3Blue1Brown</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={Jazza_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>Jazza</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={MarquesBrownlee_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>Marques Brownlee</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={Mrwhosetheboss_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>Mrwhosetheboss</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={TheOdd1sOut_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>TheOdd1sOut</label>}
          </button>

          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={Veritasium_profile_image} className="w-6 rounded-full" alt="" />
            {(isLabelVisible) && <label>Veritasium</label>}
          </button>
        </div>

        <div className="py-3">
          <button className="w-full p-2 hover:bg-[#3c3c3c] rounded-md flex gap-6 cursor-pointer">
            <img src={settings_icon} className="w-6" alt="" />
            {(isLabelVisible) && <label>Settings</label>}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar