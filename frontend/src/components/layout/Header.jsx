import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import logo from "/Zellora-Logo.png";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/questions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          <div className='logo'>
            <Link to='/' className='brand'>
              <img src={logo} alt='Zellora Logo' className='brand-logo' />
              Zellora
            </Link>
          </div>

          <form className='search-form' onSubmit={handleSearchSubmit}>
            <input
              type='text'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='search-input'
            />
            <button type='submit' className='search-button'>
              <FaSearch />
            </button>
          </form>

          <div className='mobile-menu-toggle' onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`main-nav ${isMenuOpen ? "active" : ""}`}>
            <ul className='nav-list'>
              <li className='nav-item'>
                <Link to='/' className='nav-link'>
                  Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/questions' className='nav-link'>
                  Questions
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className='nav-item'>
                    <Link to='/ask' className='nav-link ask-button'>
                      <FaPlus /> Ask Question
                    </Link>
                  </li>
                  <li className='nav-item dropdown'>
                    <button className='nav-link dropdown-toggle'>
                      <span className='user-avatar'>
                        {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                      </span>
                      {user?.username}
                    </button>
                    <div className='dropdown-menu'>
                      <Link to='/profile' className='dropdown-item'>
                        Profile
                      </Link>
                      {user?.isAdmin && (
                        <Link to='/admin' className='dropdown-item'>
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={logout} className='dropdown-item'>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className='nav-item'>
                    <Link to='/login' className='nav-link'>
                      Login
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/register' className='nav-link signup-button'>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
