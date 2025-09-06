import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// CSRF Token storage
let csrfToken = null;

// Function to get CSRF token
export const fetchCSRFToken = async () => {
  try {
    // Use the baseURL from our axios instance for consistency
    const response = await axios.get(`${baseURL}/csrf-token`, {
      withCredentials: true,
    });
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Request interceptor for adding auth token and CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for non-GET requests
    if (
      ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())
    ) {
      try {
        const token = await fetchCSRFToken();
        if (token) {
          config.headers['X-CSRF-Token'] = token;
        }
      } catch (error) {
        console.error('Error adding CSRF token to request:', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
