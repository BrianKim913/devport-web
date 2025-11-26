import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { id: 'home', label: '홈', path: '/' },
    { id: 'mypage', label: '마이페이지', path: '/mypage', requiresAuth: true },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-[#0d0f14] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
            <span className="text-xl font-bold">devport.kr</span>
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              // Hide auth-required links if not authenticated
              if (link.requiresAuth && !isAuthenticated) return null;

              return (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    onClick={() => setActiveTab(link.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === link.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user?.profileImageUrl || 'https://via.placeholder.com/40'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                  />
                  <span className="hidden md:block text-white font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a1d29] rounded-lg shadow-lg border border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-white font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="hidden md:block text-white/90 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white pb-0.5">
                  구독하기
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <span>로그인</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 12 12">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.333 2.667L7.667 6 4.333 9.333" />
                  </svg>
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
