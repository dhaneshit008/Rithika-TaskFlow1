import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';

describe('App routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/login');
  });

  it('renders the login screen by default', () => {
    render(<App />);

    expect(screen.getByText(/sign in to taskflow/i)).toBeInTheDocument();
  });
});
