/**
 * @fileoverview Unit tests for the MediaCard component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaCard from '../components/MediaCard';

const MOCK_ITEM = {
  id: 1,
  title: 'Hey Jude',
  artist: 'The Beatles',
  artwork: 'https://example.com/artwork.jpg',
  releaseDate: '1968-08-26T00:00:00Z',
  genre: 'Rock',
  mediaKind: 'song',
  viewUrl: null,
};

describe('MediaCard', () => {
  it('renders the item title and artist', () => {
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    expect(screen.getByText('Hey Jude')).toBeInTheDocument();
    expect(screen.getByText('The Beatles')).toBeInTheDocument();
  });

  it('renders the release year extracted from releaseDate', () => {
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    expect(screen.getByText('1968')).toBeInTheDocument();
  });

  it('renders the genre badge', () => {
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    expect(screen.getByText('Rock')).toBeInTheDocument();
  });

  it('calls onAddFavourite when the heart button is clicked and not yet favourited', () => {
    const onAdd = vi.fn();
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={onAdd}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /add hey jude to favourites/i }));
    expect(onAdd).toHaveBeenCalledWith(MOCK_ITEM);
  });

  it('calls onRemoveFavourite when the heart button is clicked and already favourited', () => {
    const onRemove = vi.fn();
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={onRemove}
        isFavourited={true}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /remove hey jude from favourites/i }));
    expect(onRemove).toHaveBeenCalledWith(MOCK_ITEM.id);
  });

  it('shows an artwork image when artwork URL is provided', () => {
    render(
      <MediaCard
        item={MOCK_ITEM}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    const img = screen.getByRole('img', { name: /artwork for hey jude/i });
    expect(img).toHaveAttribute('src', MOCK_ITEM.artwork);
  });

  it('shows a placeholder when no artwork is provided', () => {
    const noArtwork = { ...MOCK_ITEM, artwork: null };
    render(
      <MediaCard
        item={noArtwork}
        onAddFavourite={vi.fn()}
        onRemoveFavourite={vi.fn()}
        isFavourited={false}
      />
    );
    expect(screen.getByLabelText(/no artwork available/i)).toBeInTheDocument();
  });
});
