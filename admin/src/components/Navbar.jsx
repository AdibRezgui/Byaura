import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken('')                      // Vide le token en mémoire
    localStorage.removeItem('token')  // Supprime du localStorage
  }

  return (
    <div className="flex items-center justify-between px-[4%] py-2 shadow-sm bg-white">
      {/* Logo */}
      <img
        className="w-[max(10%,80px)]"
        src={assets.logo}
        alt="logo"
      />

      {/* Bouton Logout */}
      <button
        onClick={handleLogout}
        className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-full text-sm transition-all duration-300"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
