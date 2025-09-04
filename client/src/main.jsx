import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { BASE_URL } from './utils/constant'
import { showErrorToast } from './utils/toastUtil'
import { NavigateFunction } from 'react-router-dom'

// Attach global axios interceptors to handle auth expiry
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // Clear session and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('user');
      try { showErrorToast('Session expired. Please sign in again.'); } catch (_) {}
      // Best effort redirect
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
