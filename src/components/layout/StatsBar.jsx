import { useMemo } from 'react';
import { IconLink, IconTag, IconKeyboard, IconSparkles } from '../ui/Icons';
import './StatsBar.css';

const CATEGORIES = ['All', 'Dev', 'Social', 'Design', 'Work', 'Personal'];

export function StatsBar({ links = [], selectedCategory, onSelectCategory }) {
  const stats = useMemo(() => {
    const total = links.length;
    const categoriesCount = new Set(
      links.map((l) => {
        if (l.category) return l.category;
        try {
          const host = new URL(l.link).hostname.replace('www.', '');
          return host;
        } catch {
          return 'Other';
        }
      })
    ).size;

    return { total, categoriesCount };
  }, [links]);

  if (links.length === 0) return null;

  return (
    <div className="stats-bar-container">
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan">
            <IconLink />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Saved Links</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <IconTag />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.categoriesCount}</span>
            <span className="stat-label">Unique Sources</span>
          </div>
        </div>

        <div className="stat-card stat-card--hint">
          <div className="stat-icon stat-icon--green">
            <IconKeyboard />
          </div>
          <div className="stat-content">
            <span className="stat-value-shortcut">Press <kbd>/</kbd> or <kbd>⌘K</kbd></span>
            <span className="stat-label">Quick Search</span>
          </div>
        </div>
      </div>

      <div className="category-filter-row">
        <div className="category-filter-label">
          <IconSparkles />
          <span>Categories</span>
        </div>
        <div className="category-pills">
          {CATEGORIES.map((cat) => {
            const isActive = (selectedCategory || 'All') === cat;
            return (
              <button
                key={cat}
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat === 'All' ? null : cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
