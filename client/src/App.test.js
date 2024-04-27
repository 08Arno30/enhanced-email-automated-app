import { render, screen } from '@testing-library/react';
import LandingPage from './components/landingPage/LandingPage';

// Basic test to display sign in page
test('renders sign in page', () => {
  render(<LandingPage />);
  const linkElement = screen.getByText(/Sign In/i);
  expect(linkElement).toBeInTheDocument();
});
