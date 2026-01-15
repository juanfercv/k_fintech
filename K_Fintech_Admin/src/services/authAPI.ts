// API service for authentication

const API_BASE_URL = 'http://localhost:4200';

const authRequest = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for session cookies
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // For logout and some other requests, there might not be a response body
    if (response.status === 204 || endpoint.includes('logout')) {
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth API request error:', error);
    throw error;
  }
};

export const authAPI = {
  register: (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => authRequest('/api/auth/register', { 
    method: 'POST', 
    body: JSON.stringify(userData) 
  }),
  
  login: (email: string, password: string) => authRequest('/api/auth/login', { 
    method: 'POST', 
    body: JSON.stringify({ correo_electronico_Dueño: email, password_Dueño: password }) 
  }),
  
  logout: () => authRequest('/api/auth/logout', { method: 'POST' }),
  
  getMe: () => authRequest('/api/auth/me'),
};

export default authAPI;