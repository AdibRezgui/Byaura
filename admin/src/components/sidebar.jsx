import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        
        <NavLink
          to="/add"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="Add Icon" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.listitems_icon} alt="List Icon" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="Orders Icon" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          to="/users"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.profile_icon} alt="Users Icon" />
          <p className="hidden md:block">Utilisateurs</p>
        </NavLink>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.media_icon} alt="Médias" />
          <p className="hidden md:block">Médias</p>
        </NavLink>

        <NavLink
          to="/campaigns"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.campagnes_icon} alt="Campagnes" />
          <p className="hidden md:block">Campagnes</p>
        </NavLink>

        <NavLink
          to="/lookbook"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.lookbook_icon} alt="Lookbook" />
          <p className="hidden md:block">Lookbook</p>
        </NavLink>

        <NavLink
          to="/popups"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.location_icon} alt="Pop ups" />
          <p className="hidden md:block">Pop ups</p>
        </NavLink>

        <NavLink
          to="/soldes"
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
        >
          <img className="w-5 h-5" src={assets.sale_icon} alt="Soldes" />
          <p className="hidden md:block">Soldes</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
