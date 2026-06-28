import { assets } from "../assets/assets";
import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, profileImage, setProfileImage, backendURL, siteConfig, campaigns } =
    useContext(ShopContext);
  const dropdownRef = useRef(null);
  const editorialRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (editorialRef.current && !editorialRef.current.contains(e.target)) {
        setShowEditorial(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoSrc = siteConfig?.logo
    ? (siteConfig.logo.startsWith("http") ? siteConfig.logo : `${backendURL}${siteConfig.logo}`)
    : assets.logo;

  // 🔒 Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setProfileImage("");
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
        <img src={logoSrc} className="w-28 sm:w-36" alt="logo" />
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
        {campaigns && campaigns.length > 0 && (
          <div className="relative flex flex-col items-center gap-1" ref={editorialRef}>
            <p
              className="cursor-pointer select-none"
              onClick={() => setShowEditorial((v) => !v)}
            >
              ÉDITORIAL
            </p>
            {showEditorial && (
              <div className="absolute top-full left-0 mt-3 bg-white border border-gray-100 shadow-lg z-50 min-w-[200px] py-2">
                {campaigns.map((c) => (
                  <Link
                    key={c._id}
                    to={`/campaign/${c.slug}`}
                    onClick={() => setShowEditorial(false)}
                    className="block px-5 py-2.5 text-[13px] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        <NavLink to="/lookbook" className="flex flex-col items-center gap-1">
          <p>LOOKBOOK</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden group-hover:block" />
        </NavLink>
        <NavLink to="/pop-ups" className="flex flex-col items-center gap-1">
          <p>POP UPS</p>
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
        <div className="relative" ref={dropdownRef}>
          {token && profileImage ? (
            <img
              onClick={handleProfileClick}
              src={profileImage?.startsWith("http") ? profileImage : `${backendURL}${profileImage}`}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-200"
            />
          ) : (
            <img
              onClick={handleProfileClick}
              className="w-7 cursor-pointer"
              src={assets.profil}
              alt="profile"
            />
          )}

          {/* Dropdown profil */}
          {token && showDropdown && (
            <div className="absolute right-0 mt-3 z-50">
              <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white shadow-lg text-gray-600 rounded-lg">
                <p onClick={() => { navigate('/profile'); setShowDropdown(false); }} className="cursor-pointer hover:text-black text-sm">Mon profil</p>
                <p onClick={() => { navigate("/orders"); setShowDropdown(false); }} className="cursor-pointer hover:text-black text-sm">Mes commandes</p>
                <p onClick={logout} className="cursor-pointer hover:text-black text-sm">Déconnexion</p>
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
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/collection">
            COLLECTION
          </NavLink>
          {campaigns && campaigns.map((c) => (
            <NavLink key={c._id} onClick={() => setVisible(false)}
              className="py-3 pl-6 border-b text-gray-500" to={`/campaign/${c.slug}`}>
              {c.name.toUpperCase()}
            </NavLink>
          ))}
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/lookbook">
            LOOKBOOK
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/pop-ups">
            POP UPS
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/contact">
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
