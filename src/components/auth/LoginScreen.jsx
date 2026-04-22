import './LoginScreen.css';

export function LoginScreen({ onLogin, isAuthenticating }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>ClickZ</h1>
        <p>Sign in to access your saved links</p>
        <button className="google-btn" onClick={onLogin} disabled={isAuthenticating}>
          {isAuthenticating ? 'Redirecting...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}
