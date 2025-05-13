import axios from 'axios';

 const API_URL = 'http://localhost:5000/api';

// ==================== Auth APIs ====================
export const registerApi = async (email, password, storeName, upiId) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    storeName,
    upiId
  });
  return response.data;
};

export const loginApi = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: { 'x-auth-token': token }
  });
  return response.data.owner;
};

// ==================== Product APIs ====================
export const addProduct = async (productData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/dashboard/products`, productData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};




export const getProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Please login to view products');
    }

    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: { 
        'x-auth-token': token,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const { products } = response.data;

    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid products data format');
    }

    return products;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Session expired. Please login again');
      }
      if (error.response.status === 404) {
        throw new Error('Products endpoint not found');
      }
    }

    throw new Error(error.response?.data?.message || 
                    error.message || 
                    'Failed to load products. Please try again.');
  }
};


// ==================== Order APIs ====================
export const getStoreOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/dashboard/orders`, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
};

// Backward compatibility aliases
export const getOrders = getStoreOrders;
export const createOrder = async (slug, orderData) => {
  const response = await axios.post(`${API_URL}/store/${slug}/orders`, orderData);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/dashboard/orders/${orderId}/status`,
    { status },
    { headers: { 'x-auth-token': token } }
  );
  return response.data;
};

// ==================== Store APIs ====================
export const getStore = async (slug) => {
  const response = await axios.get(`${API_URL}/store/${slug}`);
  return response.data;
};

// Alias for createOrder (same function)
export const createStoreOrder = createOrder;

// ==================== Combined Utility ====================
export default {
  // Auth
  registerApi,
  loginApi,
  getCurrentUser,
  
  // Products
  addProduct,
  getProducts,
  
  // Orders
  getStoreOrders,
  getOrders,
  createOrder,
  updateOrderStatus,
  
  // Store
  getStore,
  createStoreOrder
};