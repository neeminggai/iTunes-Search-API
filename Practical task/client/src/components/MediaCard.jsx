/**
 * @fileoverview MediaCard component.
 * Displays a single iTunes result as a Bootstrap card including artwork,
 * title, artist, genre badge, release year, and a favourite toggle button.
 */

/** Maps iTunes media kind strings to a representative emoji icon. */
const KIND_ICON = {
  song: '🎵',
  album: '💿',
  movie: '🎬',
  podcast: '🎙️',
  audiobook: '📚',
  'tv-episode': '📺',
  software: '📱',
  ebook: '📖',
  default: '🎵',
};

/**
 * @param {Object}   props
 * @param {Object}   props.item              - Normalised iTunes media item.
 * @param {Function} props.onAddFavourite    - Called with item when user hearts it.
 * @param {Function} props.onRemoveFavourite - Called with item.id when user un-hearts.
 * @param {boolean}  props.isFavourited      - Whether the item is already favourited.
 */
function MediaCard({ item, onAddFavourite, onRemoveFavourite, isFavourited }) {
  const { id, title, artist, artwork, releaseDate, genre, mediaKind, viewUrl } = item;

  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const kindIcon = KIND_ICON[mediaKind] || KIND_ICON.default;

  /** Toggles the favourite state when the heart button is clicked. */
  function handleFavouriteToggle(e) {
    // Prevent the card link from opening while clicking the heart.
    e.preventDefault();
    e.stopPropagation();
    if (isFavourited) {
      onRemoveFavourite(id);
    } else {
      onAddFavourite(item);
    }
  }

  const cardContent = (
    <div className="card media-card">
      {/* Artwork */}
      <div className="artwork-wrapper">
        {artwork ? (
          <img src={artwork} alt={`Artwork for ${title}`} loading="lazy" />
        ) : (
          <div className="artwork-placeholder" aria-label="No artwork available">
            {kindIcon}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h6" title={title}>
          {title}
        </h3>
        <p className="card-subtitle mb-2" title={artist}>
          {artist}
        </p>

        {/* Genre + year row */}
        <div className="card-meta">
          {genre && <span className="genre-badge">{genre}</span>}
          {releaseYear && <span className="year-text">{releaseYear}</span>}

          {/* Favourite toggle */}
          <button
            className={`btn-favourite ${isFavourited ? 'is-favourite' : ''}`}
            onClick={handleFavouriteToggle}
            aria-label={isFavourited ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
            title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <i className={`bi ${isFavourited ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  // Wrap in an anchor when iTunes provides a view URL.
  if (viewUrl) {
    return (
      <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none d-block h-100">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export default MediaCard;
