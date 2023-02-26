import { render, screen } from '@testing-library/react';
import HomePage from '../components/HomePage';

test('renders homepage', () => {
  render(<HomePage />);
  const linkElement = screen.getByText(/worker coordinator/i);
  expect(linkElement).toBeInTheDocument();
});
