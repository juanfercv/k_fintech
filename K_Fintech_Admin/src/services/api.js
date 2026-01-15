// API service for connecting to the backend
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:4200' : ''; // Using relative URLs to leverage Vite proxy

// Generic function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
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
    
    // For DELETE requests, there might not be a response body
    if (response.status === 204 || endpoint.includes('DELETE')) {
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Tienda API functions
export const tiendaService = {
  getAll: () => apiRequest('/api/tiendas'),
  getById: (id) => apiRequest(`/api/tiendas/${id}`),
  create: (data) => apiRequest('/api/tiendas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/tiendas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/tiendas/${id}`, { method: 'DELETE' }),
};

// Cliente API functions
export const clienteService = {
  getAll: () => apiRequest('/api/clientes'),
  getById: (id) => apiRequest(`/api/clientes/${id}`),
  create: (data) => apiRequest('/api/clientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/clientes/${id}`, { method: 'DELETE' }),
};

// Factura API functions
export const facturaService = {
  getAll: () => apiRequest('/api/facturas'),
  getById: (id) => apiRequest(`/api/facturas/${id}`),
  create: (data) => apiRequest('/api/facturas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/facturas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/facturas/${id}`, { method: 'DELETE' }),
};

// MetodoPago API functions
export const metodoPagoService = {
  getAll: () => apiRequest('/api/formas_pago'),
  getActive: () => apiRequest('/api/formas_pago/activas'),
  getById: (id) => apiRequest(`/api/formas_pago/${id}`),
  create: (data) => apiRequest('/api/formas_pago', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/formas_pago/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/formas_pago/${id}`, { method: 'DELETE' }),
};

export default {
  tiendaService,
  clienteService,
  metodoPagoService,
  facturaService,
};