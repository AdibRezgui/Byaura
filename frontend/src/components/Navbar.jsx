import { assets } from "../assets/assets";
import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext);

  // 🔒 Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setShowDropdown(false);
    navigate("/login");
  };

  // 👤 Clic sur l’icône profil
  const handleProfileClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  return (
    <div className="flex items-center justify-between py-5 px-4 sm:px-10 font-medium relative z-50">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className="w-28 sm:w-36" alt="logo" />
      </Link>

      {/* Liens principaux (Desktop) */}
      <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
        </NavLink>
      </ul>

      {/* Partie droite */}
      <div className="flex items-center gap-4 sm:gap-6 relative">
        {/* 🔍 Recherche */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search}
          className="w-5 cursor-pointer"
          alt="search"
        />

        {/* 👤 Profil */}
        <div className="relative">
          <img
            onClick={handleProfileClick}
            className="w-7 cursor-pointer"
            src={assets.profil}
            alt="profile"
          />

          {/* Dropdown profil */}
          {token && showDropdown && (
            <div className="absolute right-0 mt-3 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white shadow-lg text-gray-600 rounded-lg">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 🛒 Panier */}
        <Link to="/cart" className="relative">
          <img src={assets.cart} className="w-8 min-w-5" alt="cart" />
          <p className="absolute right-[5px] bottom-[5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* 📱 Icône menu mobile */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu}
          className="w-6 cursor-pointer sm:hidden"
          alt="menu"
        />
      </div>

      {/* Menu mobile plein écran */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white transition-all duration-300 ease-in-out ${
          visible ? "w-full" : "w-0"
        } z-50 overflow-hidden`}
      >
        <div className="flex flex-col text-gray-700 h-full">
          {/* Bouton retour */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-100"
          >
            <img className="h-4 rotate-180" src={assets.down} alt="back" />
            <p>Back</p>
          </div>

          {/* Liens menu mobile */}
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
