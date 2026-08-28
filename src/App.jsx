import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";
import { supabase } from './lib/supabase';
import { delay } from './utils/helpers';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { LinkCard } from './components/links/LinkCard';
import { LinkForm } from './components/links/LinkForm';
import { SkeletonList } from './components/links/SkeletonList';
import { Toast } from './components/ui/Toast';
import { EmptyState } from './components/ui/EmptyState';
import { QrModal } from './components/ui/QrModal';
import { IconSearch, IconX } from './components/ui/Icons';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [qrModalItem, setQrModalItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState({ msg: null, id: 0 });

  const searchInputRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const user = session?.user ?? null;

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
          if (search) setSearch('');
        }
        return;
      }

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setShowModal(false);
        setEditingLink(null);
        setQrModalItem(null);
        setSearch('');
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowModal(true);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [search]);

  // Detect OAuth errors or tokens in URL on initial mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashString = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const hashParams = new URLSearchParams(hashString);

    const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');
    const errorMsg = searchParams.get('error') || hashParams.get('error');

    if (errorDesc || errorMsg) {
      const cleanError = decodeURIComponent((errorDesc || errorMsg).replace(/\+/g, ' '));
      setToast((prev) => ({ msg: `Authentication failed: ${cleanError}`, id: prev.id + 1 }));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Safety timeout if session checking takes too long
  useEffect(() => {
    if (!authLoading) return;
    const timer = setTimeout(() => {
      setSessionTimeout(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [authLoading]);

  useEffect(() => {
    let mounted = true;

    async function bootstrapSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session retrieval error:', error);
          if (mounted) {
            setToast((prev) => ({ msg: `Session check error: ${error.message}`, id: prev.id + 1 }));
          }
        }
        if (mounted) {
          setSession(data?.session ?? null);
        }
      } catch (err) {
        console.error('Unexpected error checking session:', err);
        if (mounted) {
          setToast((prev) => ({ msg: 'Could not restore session', id: prev.id + 1 }));
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setAuthLoading(false);
      setAuthenticating(false);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (window.location.search.includes('code=') || window.location.hash.includes('access_token=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const elapsed = Date.now() - start;
      if (elapsed < 300) {
        await delay(300 - elapsed);
      }

      setLinks(data ?? []);
    } catch {
      setToast((prev) => ({ msg: 'Could not load links', id: prev.id + 1 }));
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
      return item.name.toLowerCase().includes(query) || item.custom_id.toLowerCase().includes(query) || item.link.toLowerCase().includes(query);
    });
  }, [links, search]);

  async function handleLogin() {
    setAuthenticating(true);
    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        setToast((prev) => ({ msg: `Google Sign-in error: ${error.message}`, id: prev.id + 1 }));
        setAuthenticating(false);
      }
    } catch (err) {
      setToast((prev) => ({ msg: `Sign-in failed: ${err.message || 'Unknown error'}`, id: prev.id + 1 }));
      setAuthenticating(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setToast((prev) => ({ msg: 'Logout failed', id: prev.id + 1 }));
      return;
    }
    setToast((prev) => ({ msg: 'Logged out', id: prev.id + 1 }));
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
      setToast((prev) => ({ msg: 'Link saved successfully', id: prev.id + 1 }));
    } catch {
      setToast((prev) => ({ msg: 'Could not save link', id: prev.id + 1 }));
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy(link) {
    try {
      await navigator.clipboard.writeText(link);
      setToast((prev) => ({ msg: 'Link copied to clipboard', id: prev.id + 1 }));
    } catch {
      setToast((prev) => ({ msg: 'Copy failed — please copy manually', id: prev.id + 1 }));
    }
  }

  async function handleUpdateLink(formData) {
    if (!user || !editingLink) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('links')
        .update({
          name: formData.name,
          custom_id: formData.customId,
          link: formData.link,
        })
        .eq('id', editingLink.id)
        .eq('user_id', user.id)
        .select('id, name, custom_id, link, created_at')
        .single();

      if (error) throw error;

      setLinks((prev) => prev.map((l) => (l.id === data.id ? data : l)));
      setEditingLink(null);
      setToast((prev) => ({ msg: 'Link updated', id: prev.id + 1 }));
    } catch {
      setToast((prev) => ({ msg: 'Could not update link', id: prev.id + 1 }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLink(id) {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setLinks((prev) => prev.filter((l) => l.id !== id));
      setToast((prev) => ({ msg: 'Link deleted', id: prev.id + 1 }));
    } catch {
      setToast((prev) => ({ msg: 'Could not delete link', id: prev.id + 1 }));
    }
  }

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="spinner-ring" />
          <span>Checking session...</span>
          {sessionTimeout && (
            <button
              className="loading-fallback-btn"
              onClick={() => setAuthLoading(false)}
              type="button"
            >
              Taking too long? Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} isAuthenticating={authenticating} />
        {toast.msg && <Toast key={toast.id} message={toast.msg} onDone={() => setToast((prev) => ({ ...prev, msg: null }))} />}
        <SpeedInsights />
        <Analytics />
      </>
    );
  }

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={handleLogout}
        onAddLink={() => setShowModal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {links.length > 0 && !linksLoading && (
        <div className="search-container">
          <span className="search-icon"><IconSearch /></span>
          <input
            ref={searchInputRef}
            className="search-input"
            type="text"
            placeholder="Search links (press / or ⌘K)..."
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
            {filteredLinks.map((item, index) => (
              <LinkCard
                key={item.id}
                index={index}
                item={item}
                onCopy={handleCopy}
                onEdit={(link) => setEditingLink(link)}
                onDelete={handleDeleteLink}
                onShowQr={(link) => setQrModalItem(link)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      {(showModal || editingLink) && (
        <LinkForm
          onSave={showModal ? handleAddLink : handleUpdateLink}
          onCancel={() => { setShowModal(false); setEditingLink(null); }}
          saving={saving}
          initialData={editingLink}
        />
      )}

      {qrModalItem && (
        <QrModal
          item={qrModalItem}
          onClose={() => setQrModalItem(null)}
          onCopy={handleCopy}
        />
      )}

      {toast.msg && <Toast key={toast.id} message={toast.msg} onDone={() => setToast((prev) => ({ ...prev, msg: null }))} />}
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
