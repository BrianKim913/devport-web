import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Shared axios instance used by all domain service modules.
 * Do not create additional axios instances — use this client
 * so that auth headers and refresh/retry behavior are applied
 * consistently across all API calls.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
