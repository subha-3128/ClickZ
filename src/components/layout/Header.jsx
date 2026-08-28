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
      <div className="header-brand">
        <img src="/pwa-512.png" alt="ClickZ" className="header-logo" />
        <span className="header-title">ClickZ</span>
      </div>

      <div className="header-controls">
        <button
          className="btn-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
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
              <div className="profile-dropdown-user">
                <span className="profile-dropdown-name">{user.user_metadata?.full_name || 'User'}</span>
                <span className="profile-dropdown-email">{user.email}</span>
              </div>
              <div className="profile-dropdown-divider" />
              <button
                className="btn-logout"
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        <button className="btn-add" onClick={onAddLink}>
          <IconPlus />
          <span>New Link</span>
        </button>
      </div>
    </header>
  );
}
