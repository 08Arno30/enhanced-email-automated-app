import { render, screen } from '@testing-library/react';
import Signin from './components/signin/Signin';

// Basic test to display sign in page
test('renders sign in page', () => {
  render(<Signin />);
  const linkElement = screen.getByText(/Sign In/i);
  expect(linkElement).toBeInTheDocument();
});
