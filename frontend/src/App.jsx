import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./page/Home"
import Collection from "./page/Collection"
import About from "./page/About"
import Contact from "./page/Contact"
import Cart from "./page/Cart"
import Login from "./page/Login"
import PlaceOrder from "./page/PlaceOrder"
import Orders from "./page/Orders"
import Product from "./page/Product"
import Footer from "./components/Footer"
import SearchBar from "./components/SearchBar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// 👇 On importe ton composant d’intro
import Intro from "./components/Intro"

const App = () => {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro ? (
        // 🪄 L’intro se joue au chargement
        <Intro onFinish={() => setShowIntro(false)} />
      ) : (
        // 🌐 Le site complet après l’intro
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <ToastContainer />
          <Navbar />
          <SearchBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>

          <Footer />
        </div>
      )}
    </>
  )
}

export default App
