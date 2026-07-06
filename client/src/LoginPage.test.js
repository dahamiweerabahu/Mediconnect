import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import axios from 'axios';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock axios
jest.mock('axios');

describe('LoginPage Offline Fallbacks', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('offline signup saves user to localStorage and switches to login mode', async () => {
    // Mock network error
    axios.post.mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' });

    render(<LoginPage />);

    // Toggle to Sign Up mode
    const signUpTab = screen.getByRole('button', { name: /^sign up$/i });
    fireEvent.click(signUpTab);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), { target: { value: 'offlinedoc' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: 'offlinedoc@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'pass123' } });
    
    // Select role
    const roleSelect = screen.getByLabelText(/account role/i);
    fireEvent.change(roleSelect, { target: { value: 'doctor' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('[Offline Demo Session] Registration Successful!');
    });

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('mc_users'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual({
      id: expect.any(Number),
      username: 'offlinedoc',
      email: 'offlinedoc@test.com',
      password: 'pass123',
      role: 'doctor'
    });
  });

  test('offline login with local registered credentials success and redirects to dashboard with correct role', async () => {
    // Seed offline users
    const userSeed = [{ id: 123, username: 'offlineadmin', email: 'admin@offline.com', password: 'secretpassword', role: 'admin' }];
    localStorage.setItem('mc_users', JSON.stringify(userSeed));

    // Mock network error on login request
    axios.post.mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' });

    render(<LoginPage />);

    // Fill credentials
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), { target: { value: 'offlineadmin' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'secretpassword' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /^login$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('[Offline Demo Session] Successful! Logged in as admin.');
    });

    // Verify localStorage 'user' set
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    expect(loggedUser).toEqual({
      id: 123,
      username: 'offlineadmin',
      email: 'admin@offline.com',
      role: 'admin'
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('offline login with invalid credentials shows error and does not log in', async () => {
    axios.post.mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), { target: { value: 'nonexistent' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'wrongpass' } });

    const submitBtn = screen.getByRole('button', { name: /^login$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid username or password! (Offline Mode)');
    });

    expect(localStorage.getItem('user')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
