import { useState, useRef, useEffect } from 'react';
import { getInitials } from '../../utils/helpers';
import { IconPlus, IconSun, IconMoon } from '../ui/Icons';
import './Header.css';

export function Header({ user, onLogout, onAddLink, theme, toggleTheme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-nav">
        {/* Brand Logo & Title */}
        <div className="header-brand">
          <img src="/pwa-512.png" alt="ClickZ" className="header-logo" />
          <h1>ClickZ</h1>
        </div>

        {/* User Controls: Theme Toggle & Avatar */}
        <div className="header-controls">
          <button className="btn-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className={`theme-toggle-icon ${theme}`}>
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </span>
          </button>

          <div className="profile-container" ref={containerRef}>
            <button
              className="profile-chip"
              title={user.email || 'User'}
              aria-expanded={showDropdown}
              aria-haspopup="true"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile avatar" />
              ) : (
                <span>{getInitials(user.user_metadata?.full_name || user.email || 'U')}</span>
              )}
            </button>

            {showDropdown && (
              <div className="profile-dropdown">
                <button className="btn-logout" onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}>
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="btn-add btn-add-desktop" onClick={onAddLink}>
            <IconPlus />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Mobile Add Button Bar */}
      <button className="btn-add btn-add-mobile" onClick={onAddLink}>
        <IconPlus />
        <span>Add Link</span>
      </button>
    </header>
  );
}


