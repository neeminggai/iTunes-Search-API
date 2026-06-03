/**
 * @fileoverview Unit tests for the SearchBar component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('renders a text input and a search button', () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    expect(screen.getByRole('searchbox', { name: /search term/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders a media type dropdown with "All Media" as default', () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    const select = screen.getByRole('combobox', { name: /media type/i });
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('all');
  });

  it('disables the search button while loading', () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  it('disables the search button when the input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  it('calls onSearch with the trimmed term and selected media on submit', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  beatles  ' } });
    fireEvent.change(screen.getByRole('combobox', { name: /media type/i }), {
      target: { value: 'music' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('beatles', 'music');
  });

  it('does not call onSearch when the input is whitespace only', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form'));

    expect(onSearch).not.toHaveBeenCalled();
  });
});
