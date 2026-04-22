import { getInitials } from '../../utils/helpers';
import { IconPlus } from '../ui/Icons';
import './Header.css';

export function Header({ user, onLogout, onAddLink }) {
  return (
    <header className="header">
      <div className="header-brand">
        <img src="/pwa-512.png" alt="ClickZ" className="header-logo" />
        <h1>ClickZ</h1>
      </div>

      <div className="header-actions">
        <button className="btn-add" onClick={onAddLink}>
          <IconPlus />
          Add
        </button>
        <div className="profile-chip" title={user.email || 'User'}>
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Profile avatar" />
          ) : (
            <span>{getInitials(user.user_metadata?.full_name || user.email || 'U')}</span>
          )}
        </div>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
