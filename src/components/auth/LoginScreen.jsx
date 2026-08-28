import { IconGithub, IconLinkedin } from '../ui/Icons';
import './LoginScreen.css';

export function LoginScreen({ onLogin, isAuthenticating }) {
  return (
    <main className="login-screen">
      <div className="login-card">
        <header className="login-header">
          <div className="login-logo-glow">
            <img src="/pwa-512.png" alt="ClickZ Link Manager Logo" className="login-logo" />
          </div>
          <h1>ClickZ</h1>
          <p className="tagline">Next-Gen Link & Bookmark Hub</p>
        </header>

        <p className="login-description">
          Organize, search, generate QR codes, and access all your links instantly in a high-speed glassmorphic dashboard.
        </p>

        <button className="google-btn" onClick={onLogin} disabled={isAuthenticating} aria-label="Sign in with Google">
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{isAuthenticating ? 'Redirecting to Google...' : 'Continue with Google'}</span>
        </button>

        <footer className="login-credit-card">
          <div className="credit-text">
            <span>Crafted with ❤️ by</span>
            <strong>Subhajit Bepari</strong>
          </div>
          <div className="credit-social-links">
            <a
              href="https://github.com/subha-3128"
              target="_blank"
              rel="noopener noreferrer"
              className="credit-social-btn"
              title="View Source on GitHub"
            >
              <IconGithub />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/subhajit-bepari/"
              target="_blank"
              rel="noopener noreferrer"
              className="credit-social-btn"
              title="Connect on LinkedIn"
            >
              <IconLinkedin />
              <span>LinkedIn</span>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
