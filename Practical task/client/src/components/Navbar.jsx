/**
 * @fileoverview Application navigation bar.
 * Displays the brand logo/name and a button to open the favourites panel.
 * On small screens the favourites button triggers a Bootstrap Offcanvas.
 * On larger screens it toggles an inline sidebar in App.jsx.
 */

/**
 * @param {Object}   props
 * @param {number}   props.favouriteCount     - Number of saved favourites.
 * @param {Function} props.onFavouritesClick  - Called when favourites button clicked.
 */
function Navbar({ favouriteCount, onFavouritesClick }) {
  return (
    <nav className="app-navbar navbar navbar-expand-lg">
      <div className="container-lg d-flex align-items-center justify-content-between">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" href="/">
          <i className="bi bi-music-note-beamed brand-icon" aria-hidden="true" />
          <span className="brand-text">iTunes Explorer</span>
        </a>

        {/* Favourites toggle button */}
        <button
          className="btn btn-favourites"
          onClick={onFavouritesClick}
          // Also supports Bootstrap offcanvas on mobile
          data-bs-toggle="offcanvas"
          data-bs-target="#favouritesOffcanvas"
          aria-controls="favouritesOffcanvas"
          aria-label={`Open favourites list (${favouriteCount} items)`}
        >
          <i className="bi bi-heart-fill me-1" aria-hidden="true" />
          Favourites
          {favouriteCount > 0 && (
            <span className="badge bg-white text-danger ms-2 rounded-pill">
              {favouriteCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
