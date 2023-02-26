import { render, screen } from '@testing-library/react';
import HomePage from '../components/HomePage';

test('renders homepage', () => {
  render(<HomePage />);
  const titleElement = screen.getByText(/worker coordinator/i);
  const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
  const signInButton = screen.getByRole('button', { name: 'Sign In' });
  expect(titleElement).toBeInTheDocument();
  expect(signUpButton).toBeInTheDocument();
  expect(signInButton).toBeInTheDocument();
});
