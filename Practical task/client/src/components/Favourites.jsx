/**
 * @fileoverview Favourites panel component.
 * Displays a scrollable list of saved media items. Rendered both as an
 * inline sidebar (desktop) and inside a Bootstrap Offcanvas (mobile).
 */

/**
 * @param {Object}    props
 * @param {Object[]}  props.items    - Array of favourited iTunes items.
 * @param {Function}  props.onRemove - Called with item.id to remove a favourite.
 * @param {Function}  [props.onClose]- Optional close handler for the sidebar variant.
 */
function Favourites({ items, onRemove, onClose }) {
  return (
    <div className="favourites-panel">
      {/* Header is only shown in the sidebar variant (desktop) */}
      {onClose && (
        <div className="favourites-panel-header">
          <h5>
            <i className="bi bi-heart-fill text-danger me-2" aria-hidden="true" />
            Favourites
            {items.length > 0 && (
              <span className="badge bg-danger ms-2 rounded-pill">{items.length}</span>
            )}
          </h5>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={onClose}
            aria-label="Close favourites panel"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Content */}
      {items.length === 0 ? (
        <div className="favourites-empty">
          <i className="bi bi-heart text-secondary" aria-hidden="true" />
          <p className="small text-muted mb-0">
            No favourites yet.
            <br />
            Tap the <i className="bi bi-heart" /> on any result.
          </p>
        </div>
      ) : (
        <ul className="favourites-list list-unstyled mb-0" aria-label="Favourites list">
          {items.map((item) => (
            <li key={item.id} className="favourite-item">
              {/* Artwork thumbnail */}
              {item.artwork ? (
                <img src={item.artwork} alt={`Artwork for ${item.title}`} />
              ) : (
                <div className="favourite-item-placeholder" aria-hidden="true">
                  🎵
                </div>
              )}

              {/* Text info */}
              <div className="favourite-item-info">
                <p className="favourite-item-title mb-0" title={item.title}>
                  {item.title}
                </p>
                <p className="favourite-item-artist mb-0" title={item.artist}>
                  {item.artist}
                </p>
              </div>

              {/* Remove button */}
              <button
                className="btn-remove"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.title} from favourites`}
                title="Remove from favourites"
              >
                <i className="bi bi-x-circle-fill" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favourites;
