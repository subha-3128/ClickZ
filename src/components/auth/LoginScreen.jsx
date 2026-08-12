import { IconGithub, IconLinkedin } from '../ui/Icons';
import './LoginScreen.css';

export function LoginScreen({ onLogin, isAuthenticating }) {
  return (
    <main className="login-screen">
      <div className="login-card">
        <header className="login-header">
          <img src="/pwa-512.png" alt="ClickZ Link Manager Logo" className="login-logo" />
          <h1>ClickZ</h1>
          <p className="tagline">Minimal, Fast &amp; Secure Link Management</p>
        </header>

        <p className="login-description">
          Organize, search, and access all your saved links effortlessly in one unified workspace.
        </p>

        <button className="google-btn" onClick={onLogin} disabled={isAuthenticating} aria-label="Sign in with Google">
          {isAuthenticating ? 'Redirecting...' : 'Continue with Google'}
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


