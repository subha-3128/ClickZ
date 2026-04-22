import './SkeletonList.css';

export function SkeletonList({ count = 6 }) {
  return (
    <div className="skeleton-list" aria-label="Loading links">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={`skeleton-${index}`} aria-hidden="true">
          <div className="skeleton-logo shimmer" />
          <div className="skeleton-info">
            <div className="skeleton-line skeleton-line-name shimmer" />
            <div className="skeleton-line skeleton-line-id shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
