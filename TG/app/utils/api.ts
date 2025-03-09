// API utility functions for authentication

const API_BASE_URL = 'http://127.0.0.1:5000'; // Update this with your actual backend URL

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }
    
    // Store user data in session storage
    if (data.success) {
      sessionStorage.setItem('user', JSON.stringify({
        token: data.token,
        user_id: data.user_id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        userRole: data.userRole,
        regNumber: data.regNumber,
        primaryCountry: data.primaryCountry,
        shippingVolume: data.shippingVolume,
        created_at: data.created_at,
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register a new user
 */
export async function registerUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  userRole: string;
  companyType?: string;
  regNumber?: string;
  primaryCountry: string;
  shippingVolume?: string;
  password: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const user = sessionStorage.getItem('user');
  return !!user;
}

/**
 * Get current user data
 */
export function getCurrentUser() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Logout user
 */
export function logoutUser() {
  sessionStorage.removeItem('user');
}

/**
 * Add a new consignment
 */
export async function addConsignment(formData: FormData) {
  try {
    const token = JSON.parse(sessionStorage.getItem('user') || '{}').token;
    
    const response = await fetch(`${API_BASE_URL}/consignment/add-consignment`, {
      method: 'POST',
      headers: {
        'Authorization': `${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add consignment');
    }
    
    return data;
  } catch (error) {
    console.error('Add consignment error:', error);
    throw error;
  }
}

/**
 * Search for HS Code based on categories and country
 */
export async function searchHSCode(data: {
  main_category: string;
  sub_category: string;
  destination_country: string;
}) {
  try {
    const token = JSON.parse(sessionStorage.getItem('user') || '{}').token;
    
    const response = await fetch(`${API_BASE_URL}/consignment/search-hs-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || responseData.message || 'Failed to fetch HS code');
    }
    
    return responseData;
  } catch (error: any) {
    console.error('Search HS code error:', error);
    throw new Error(error.message || 'Failed to fetch HS code');
  }
} 