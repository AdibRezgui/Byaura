import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/sidebar'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Campaigns from './pages/Campaigns'
import Lookbook from './pages/Lookbook'
import PopUps from './pages/PopUps'
import Soldes from './pages/Soldes'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'TND'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className="bg-gray-50 min-h-screen text-gray-700 text-base">
      <ToastContainer />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto my-8 px-4">
              <Routes>
                <Route path="/" element={<Navigate to="/add" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/settings" element={<Settings token={token} />} />
                <Route path="/users" element={<Users token={token} />} />
                <Route path="/campaigns" element={<Campaigns token={token} />} />
                <Route path="/lookbook" element={<Lookbook token={token} />} />
                <Route path="/popups" element={<PopUps token={token} />} />
                <Route path="/soldes" element={<Soldes token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
