import { useState, useRef, useEffect } from 'react';
import { isValidUrl, getInitials } from '../../utils/helpers';
import { IconX, IconSparkles } from '../ui/Icons';
import './LinkForm.css';

const CATEGORY_OPTIONS = ['Dev', 'Social', 'Design', 'Work', 'Personal'];

export function LinkForm({ onSave, onCancel, saving, initialData }) {
  const isEditing = Boolean(initialData);
  const [name, setName] = useState(initialData?.name || '');
  const [customId, setCustomId] = useState(initialData?.custom_id || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [category, setCategory] = useState(initialData?.category || 'Dev');
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, []);

  function handleLinkChange(val) {
    setLink(val);
    setErrors((prev) => ({ ...prev, link: '' }));

    if (val.trim() && isValidUrl(val.trim())) {
      try {
        const parsed = new URL(val.trim());
        const hostParts = parsed.hostname.replace('www.', '').split('.');
        const domainName = hostParts[0];
        const formattedName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

        if (!name) {
          setName(formattedName);
        }
        if (!customId) {
          const pathSlug = parsed.pathname.replace(/^\/|\/$/g, '').replace(/[/_]/g, '-');
          const autoId = pathSlug ? `${domainName}-${pathSlug}` : domainName;
          setCustomId(autoId.toLowerCase().slice(0, 30));
        }
      } catch {
        // ignore parsing error
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!customId.trim()) nextErrors.customId = 'ID is required';
    if (!link.trim()) {
      nextErrors.link = 'Link is required';
    } else if (!isValidUrl(link.trim())) {
      nextErrors.link = 'Enter a valid URL (https://...)';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      name: name.trim(),
      customId: customId.trim(),
      link: link.trim(),
      category,
    });
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !saving) {
      onCancel();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-link-title">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="add-link-title">{isEditing ? 'Edit Link' : 'Add Link'}</h2>
            <span className="modal-subtitle">Organize and save your bookmark</span>
          </div>
          <button className="modal-close" onClick={onCancel} disabled={saving} aria-label="Close">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="link">URL *</label>
            <input
              id="link"
              className={`form-input ${errors.link ? 'error' : ''}`}
              type="url"
              placeholder="https://example.com/project"
              value={link}
              onChange={(e) => handleLinkChange(e.target.value)}
            />
            {errors.link && <div className="form-error">{errors.link}</div>}
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Display Name *</label>
              <input
                ref={nameRef}
                id="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                type="text"
                placeholder="e.g. GitHub Repository"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="custom-id">Custom Handle / ID *</label>
              <input
                id="custom-id"
                className={`form-input ${errors.customId ? 'error' : ''}`}
                type="text"
                placeholder="e.g. github-main"
                value={customId}
                onChange={(event) => {
                  setCustomId(event.target.value);
                  setErrors((prev) => ({ ...prev, customId: '' }));
                }}
              />
              {errors.customId && <div className="form-error">{errors.customId}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category Tag</label>
            <div className="form-category-chips">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`form-category-chip ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="form-preview-box">
            <div className="form-preview-header">
              <IconSparkles />
              <span>Live Card Preview</span>
            </div>
            <div className="form-preview-card">
              <div className="form-preview-logo">
                {getInitials(name || 'Link')}
              </div>
              <div className="form-preview-info">
                <div className="form-preview-name">{name || 'Link Name Preview'}</div>
                <div className="form-preview-sub">
                  <span className="form-preview-pill">@{customId || 'handle'}</span>
                  <span className="form-preview-tag">{category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (isEditing ? 'Saving...' : 'Saving...') : (isEditing ? 'Save Changes' : 'Save Link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
