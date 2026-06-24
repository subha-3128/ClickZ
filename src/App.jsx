import { useCallback, useEffect, useMemo, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
  const [editingLink, setEditingLink] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState({ msg: null, id: 0 });

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await delay(500 - elapsed);
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
        setToast((prev) => ({ msg: 'Sign-in failed', id: prev.id + 1 }));
        setAuthenticating(false);
      }
    } catch {
      setToast((prev) => ({ msg: 'Sign-in failed', id: prev.id + 1 }));
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
      setToast((prev) => ({ msg: 'Link saved', id: prev.id + 1 }));
    } catch {
      setToast((prev) => ({ msg: 'Could not save link', id: prev.id + 1 }));
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy(link) {
    try {
      await navigator.clipboard.writeText(link);
      setToast((prev) => ({ msg: 'Link copied', id: prev.id + 1 }));
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
        <div className="loading-card">Checking session...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} isAuthenticating={authenticating} />
        {toast.msg && <Toast key={toast.id} message={toast.msg} onDone={() => setToast((prev) => ({ ...prev, msg: null }))} />}
        <SpeedInsights />
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
              <LinkCard
                key={item.id}
                item={item}
                onCopy={handleCopy}
                onEdit={(link) => setEditingLink(link)}
                onDelete={handleDeleteLink}
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

      {toast.msg && <Toast key={toast.id} message={toast.msg} onDone={() => setToast((prev) => ({ ...prev, msg: null }))} />}
      <SpeedInsights />
    </div>
  );
}
