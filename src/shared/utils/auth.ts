import { isNil } from 'lodash';

import { TOKEN_KEY } from '../../constants/config';
import { User } from '../types';

export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token; // Returns true if token exists, false otherwise
};

export const persistToken = (token: string) => localStorage.setItem('img-motion-auth-token', token);

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAdmin = (user: User | undefined) => !isNil(user) && user?.role === 'admin';
