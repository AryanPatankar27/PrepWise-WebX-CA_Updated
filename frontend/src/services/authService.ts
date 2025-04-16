import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5000/api';

// User interface - simplified for guest mode
export interface User {
  id: string;
  username: string;
}

// Since we're moving to a guest-only model
const GUEST_USER: User = {
  id: 'guest-user',
  username: 'Guest'
};

// Get the current user - in this simplified version, always returns the guest user
export const getUser = (): User => {
  return GUEST_USER;
};

// Simplified check auth function - just returns the guest user
export const checkAuth = async (): Promise<User> => {
  return GUEST_USER;
};

// Simplified login function for guest mode
export const login = async (): Promise<{user: User}> => {
  return { user: GUEST_USER };
};

// Simplified register function for guest mode
export const register = async (): Promise<{user: User}> => {
  return { user: GUEST_USER };
};

// No-op logout since we're always in guest mode
export const logout = (): void => {
  // No-op since we don't actually logout in guest mode
};

// Get the current user - always guest in this simplified version
export const getCurrentUser = (): User => {
  return GUEST_USER;
};

// Simplified token getter - not actually used but kept for compatibility
export const getToken = (): string | null => {
  return null;
};

// Always returns true in guest mode
export const isAuthenticated = (): boolean => {
  return true;
}; 