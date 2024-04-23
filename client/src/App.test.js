import { render, screen } from '@testing-library/react';
import App from './App';

// Basic test to display sign in page
test('renders sign in page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sign In/i);
  expect(linkElement).toBeInTheDocument();
});
