import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import { delay } from './utils/helpers';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { LinkCard } from './components/links/LinkCard';
import { LinkForm } from './components/links/LinkForm';
import { SkeletonList } from './components/links/SkeletonList';
import { Toast } from './components/ui/Toast';
import { EmptyState } from './components/ui/EmptyState';
import { IconSearch, IconX } from './components/ui/Icons';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const user = session?.user ?? null;

  useEffect(() => {
    let mounted = true;

    async function bootstrapSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    }

    bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      if (!nextSession) {
        setLinks([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchLinks = useCallback(async () => {
    if (!user) return;

    const start = Date.now();
    setLinksLoading(true);

    try {
      const { data, error } = await supabase
        .from('links')
        .select('id, name, custom_id, link, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await delay(500 - elapsed);
      }

      setLinks(data ?? []);
    } catch {
      setToast('Could not load links');
    } finally {
      setLinksLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const timer = window.setTimeout(() => {
      fetchLinks();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [user, fetchLinks]);

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return links;

    return links.filter((item) => {
      return item.name.toLowerCase().includes(query) || item.custom_id.toLowerCase().includes(query);
    });
  }, [links, search]);

  async function handleLogin() {
    setAuthenticating(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setToast('Sign-in failed');
        setAuthenticating(false);
      }
    } catch {
      setToast('Sign-in failed');
      setAuthenticating(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setToast('Logout failed');
      return;
    }
    setToast('Logged out');
  }

  async function handleAddLink(formData) {
    if (!user) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          name: formData.name,
          custom_id: formData.customId,
          link: formData.link,
        })
        .select('id, name, custom_id, link, created_at')
        .single();

      if (error) throw error;

      setLinks((prev) => [data, ...prev]);
      setShowModal(false);
      setToast('Link saved');
    } catch {
      setToast('Could not save link');
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy(link) {
    try {
      await navigator.clipboard.writeText(link);
      setToast('Link copied');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToast('Link copied');
    }
  }

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">Checking session...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} isAuthenticating={authenticating} />
        {toast && <Toast key={toast} message={toast} onDone={() => setToast(null)} />}
      </>
    );
  }

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} onAddLink={() => setShowModal(true)} />

      {links.length > 0 && !linksLoading && (
        <div className="search-container">
          <span className="search-icon"><IconSearch /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <IconX />
            </button>
          )}
        </div>
      )}

      <main className="content-area">
        {linksLoading ? (
          <SkeletonList count={6} />
        ) : filteredLinks.length > 0 ? (
          <div className="link-list">
            {filteredLinks.map((item) => (
              <LinkCard key={item.id} item={item} onCopy={handleCopy} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      {showModal && (
        <LinkForm
          onSave={handleAddLink}
          onCancel={() => setShowModal(false)}
          saving={saving}
        />
      )}

      {toast && <Toast key={toast} message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
