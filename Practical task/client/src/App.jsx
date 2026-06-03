/**
 * @fileoverview Root application component.
 * Manages global state: search results, favourites, loading, and errors.
 */

import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Favourites from './components/Favourites';
import { searchItunes } from './api/itunesApi';

/**
 * App is the top-level component that owns all shared state and passes
 * handlers down to child components via props.
 */
function App() {
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);

  /**
   * Executes a search and updates result state.
   *
   * @param {string} term - Search keyword(s).
   * @param {string} media - iTunes media type.
   */
  const handleSearch = useCallback(async (term, media) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await searchItunes(term, media);
      setResults(data.results);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds an item to the favourites list if not already present.
   *
   * @param {Object} item - Normalised iTunes media item.
   */
  const handleAddFavourite = useCallback((item) => {
    setFavourites((prev) => {
      if (prev.some((f) => f.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  /**
   * Removes an item from the favourites list by its id.
   *
   * @param {number|string} id - The item's unique identifier.
   */
  const handleRemoveFavourite = useCallback((id) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  /** Returns true if the given item is currently favourited. */
  const isFavourited = useCallback(
    (id) => favourites.some((f) => f.id === id),
    [favourites]
  );

  return (
    <div className="app-wrapper">
      <Navbar
        favouriteCount={favourites.length}
        onFavouritesClick={() => setShowFavourites(true)}
      />

      <main className="container-lg py-4">
        <SearchBar onSearch={handleSearch} loading={loading} />

        <div className="row g-4 mt-2">
          {/* ── Search Results ── */}
          <div className={showFavourites ? 'col-12 col-lg-8' : 'col-12'}>
            <SearchResults
              results={results}
              loading={loading}
              error={error}
              hasSearched={hasSearched}
              onAddFavourite={handleAddFavourite}
              onRemoveFavourite={handleRemoveFavourite}
              isFavourited={isFavourited}
            />
          </div>

          {/* ── Favourites Sidebar (desktop) ── */}
          {showFavourites && (
            <div className="col-12 col-lg-4">
              <Favourites
                items={favourites}
                onRemove={handleRemoveFavourite}
                onClose={() => setShowFavourites(false)}
              />
            </div>
          )}
        </div>
      </main>

      {/* ── Favourites Offcanvas (mobile) – rendered via Bootstrap JS ── */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="favouritesOffcanvas"
        aria-labelledby="favouritesOffcanvasLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="favouritesOffcanvasLabel">
            <i className="bi bi-heart-fill text-danger me-2" />
            Favourites
            {favourites.length > 0 && (
              <span className="badge bg-danger ms-2">{favourites.length}</span>
            )}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body p-0">
          <Favourites items={favourites} onRemove={handleRemoveFavourite} />
        </div>
      </div>
    </div>
  );
}

export default App;
