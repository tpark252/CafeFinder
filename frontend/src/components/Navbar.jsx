import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MagnifyingGlassIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline'
import logo from '../assets/CafeFinder_Logo.png'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="CafeFinder Logo" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cafes, locations..."
                className="input-field pl-10 pr-4"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="text-gray-600 hover:text-coffee-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  to="/add-cafe"
                  className="flex items-center space-x-1 btn-secondary"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Café</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-coffee-600 px-3 py-2 rounded-md text-sm font-medium">
                    <UserIcon className="h-5 w-5" />
                    <span>{user.username}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {user.roles && user.roles.includes('ADMIN') && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        🔧 Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-coffee-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
