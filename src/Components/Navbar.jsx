import '../App.css'
import menu_icon from '../assets/menu-icon.png'
import youtube_logo_text from '../assets/youtube-logo-text.png'
import search_icon from '../assets/search-icon.png'
import microphone_icon from '../assets/microphone-icon.png'
import profile_icon from '../assets/profile-icon.png'

const Navbar = () => {
    return (
        <nav className="py-2 px-7 bg-[#181818] flex justify-between sticky top-0">
            <div className="flex items-center gap-6">
                <img src={menu_icon} className="w-6" alt="" />
                <img src={youtube_logo_text} className="w-21" alt="" />
            </div>

            <div className="w-2/5 flex items-center gap-5">
                <div className="w-full py-2 px-4 border border-[#3d3d3d] focus-within:border-[#065fd4] rounded-3xl flex items-center gap-2">
                    <input placeholder="Search" type="text" className="w-full outline-none text-slate-100" />
                    <img src={search_icon} className="size-5" alt="" />
                </div>

                <img src={microphone_icon} className="size-5" alt="" />
            </div>

            <div className="flex items-center gap-5">
                <button type="button" className="py-1 px-3 bg-[#2e2e2e] hover:bg-[#3c3c3c] rounded-3xl text-slate-100 cursor-pointer">
                    + Create
                </button>

                <img src={profile_icon} className="size-6" alt="" />
            </div>
        </nav>
    )
}

export default Navbar