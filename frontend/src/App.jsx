import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CafeDetails from './pages/CafeDetails'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AddCafe from './pages/AddCafe'
import Status from './pages/Status'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cafe/:id" element={<CafeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-cafe" element={<AddCafe />} />
            <Route path="/status" element={<Status />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
