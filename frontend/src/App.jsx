import React from "react"
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
import Profile from "./page/Profile"
import Product from "./page/Product"
import CampaignPage from "./page/CampaignPage"
import Lookbook from "./page/Lookbook"
import LookDetail from "./page/LookDetail"
import PopUps from "./page/PopUps"
import NotFound from "./page/NotFound"
import LegalPage from "./page/LegalPage"
import Footer from "./components/Footer"
import SearchBar from "./components/SearchBar"
import SaleBanner from "./components/SaleBanner"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const App = () => {
  return (
    <>
      <SaleBanner />
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        closeButton={false}
        newestOnTop
        toastClassName="aura-toast"
        bodyClassName="aura-toast-body"
        icon={false}
      />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/campaign/:slug" element={<CampaignPage />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/lookbook/:id" element={<LookDetail />} />
        <Route path="/pop-ups" element={<PopUps />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
    </>
  )
}

export default App
