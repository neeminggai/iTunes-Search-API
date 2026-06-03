/**
 * @fileoverview SearchResults component.
 * Renders a responsive grid of MediaCard components, or one of several
 * empty-state messages depending on the current application state.
 */

import MediaCard from './MediaCard';

/**
 * @param {Object}   props
 * @param {Object[]} props.results           - Array of normalised iTunes items.
 * @param {boolean}  props.loading           - Show loading spinner when true.
 * @param {string}   props.error             - Error message to display.
 * @param {boolean}  props.hasSearched       - Whether the user has submitted a search.
 * @param {Function} props.onAddFavourite    - Passed to each MediaCard.
 * @param {Function} props.onRemoveFavourite - Passed to each MediaCard.
 * @param {Function} props.isFavourited      - (id) => boolean, passed to each MediaCard.
 */
function SearchResults({
  results,
  loading,
  error,
  hasSearched,
  onAddFavourite,
  onRemoveFavourite,
  isFavourited,
}) {
  // ── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="state-container" aria-live="polite" aria-busy="true">
        <div className="spinner-border spinner-brand" role="status">
          <span className="visually-hidden">Searching…</span>
        </div>
        <p className="mt-3">Searching iTunes…</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────
  if (error) {
    return (
      <div className="state-container" role="alert">
        <span className="state-icon">⚠️</span>
        <p className="text-danger fw-semibold">{error}</p>
      </div>
    );
  }

  // ── Pre-search welcome state ──────────────────────────────────────
  if (!hasSearched) {
    return (
      <div className="state-container">
        <span className="state-icon">🎧</span>
        <p>Enter a search term above to explore music, movies, podcasts, and more.</p>
      </div>
    );
  }

  // ── Empty results state ───────────────────────────────────────────
  if (results.length === 0) {
    return (
      <div className="state-container" aria-live="polite">
        <span className="state-icon">🔍</span>
        <p>No results found. Try a different search term or media type.</p>
      </div>
    );
  }

  // ── Results grid ──────────────────────────────────────────────────
  return (
    <section aria-label="Search results">
      <div className="results-header">
        <h2 className="h6 mb-0 fw-semibold text-secondary">Results</h2>
        <span className="results-count">{results.length} item{results.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3" aria-live="polite">
        {results.map((item) => (
          <div key={item.id ?? `${item.title}-${item.artist}`} className="col">
            <MediaCard
              item={item}
              onAddFavourite={onAddFavourite}
              onRemoveFavourite={onRemoveFavourite}
              isFavourited={isFavourited(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SearchResults;
