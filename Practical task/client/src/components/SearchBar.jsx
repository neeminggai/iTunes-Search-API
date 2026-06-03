/**
 * @fileoverview SearchBar component.
 * Contains a text input, a media-type selector, and a Search button.
 * Calls props.onSearch(term, media) when the form is submitted.
 */

import { useState } from 'react';

/** Available media types shown in the dropdown. */
const MEDIA_TYPES = [
  { label: 'All Media', value: 'all' },
  { label: 'Music', value: 'music' },
  { label: 'Movie', value: 'movie' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Audiobook', value: 'audiobook' },
  { label: 'Short Film', value: 'short film' },
  { label: 'TV Show', value: 'tvshow' },
  { label: 'Software', value: 'software' },
  { label: 'E-Book', value: 'ebook' },
];

/**
 * @param {Object}   props
 * @param {Function} props.onSearch  - Callback: (term: string, media: string) => void.
 * @param {boolean}  props.loading   - Disables the search button while true.
 */
function SearchBar({ onSearch, loading }) {
  const [term, setTerm] = useState('');
  const [media, setMedia] = useState('all');

  /**
   * Handles form submission.
   * Prevents default and calls onSearch if the term is non-empty.
   *
   * @param {React.FormEvent} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    onSearch(trimmed, media);
  }

  return (
    <section className="search-section" aria-label="Search">
      <h2 className="mb-3">
        <i className="bi bi-search me-2" aria-hidden="true" />
        Search iTunes
      </h2>
      <form onSubmit={handleSubmit} role="search">
        <div className="input-group input-group-lg">
          <input
            type="search"
            className="form-control search-input"
            placeholder="Artist, album, movie, podcast…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search term"
            required
            autoFocus
          />

          {/* Media type selector sits between the text field and the button */}
          <select
            className="form-select media-select"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            aria-label="Media type"
            style={{ maxWidth: '160px' }}
          >
            {MEDIA_TYPES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn btn-search"
            disabled={loading || !term.trim()}
            aria-label={loading ? 'Searching' : 'Search'}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                />
                Searching…
              </>
            ) : (
              <>
                <i className="bi bi-search me-1" aria-hidden="true" />
                Search
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SearchBar;
