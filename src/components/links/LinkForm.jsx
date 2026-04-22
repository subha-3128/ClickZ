import { useState, useRef, useEffect } from 'react';
import { isValidUrl } from '../../utils/helpers';
import { IconX } from '../ui/Icons';
import './LinkForm.css';

export function LinkForm({ onSave, onCancel, saving }) {
  const [name, setName] = useState('');
  const [customId, setCustomId] = useState('');
  const [link, setLink] = useState('');
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, []);

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
          <h2 id="add-link-title">Add Link</h2>
          <button className="modal-close" onClick={onCancel} disabled={saving} aria-label="Close">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name *</label>
            <input
              ref={nameRef}
              id="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              type="text"
              placeholder="e.g. GitHub"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="custom-id">ID *</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="link">Link *</label>
            <input
              id="link"
              className={`form-input ${errors.link ? 'error' : ''}`}
              type="url"
              placeholder="https://example.com"
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
                setErrors((prev) => ({ ...prev, link: '' }));
              }}
            />
            {errors.link && <div className="form-error">{errors.link}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
