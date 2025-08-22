// Mock authentication service
const STORAGE_KEY = 'crm_auth_token';
const USER_KEY = 'crm_user_data';

// Mock user database
const mockUsers = [
  {
    Id: 1,
    email: 'admin@pipelinepro.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator'
  },
  {
    Id: 2,
    email: 'user@pipelinepro.com',
    password: 'user123',
    name: 'Regular User',
    role: 'User'
  }
];

const authService = {
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate mock token
    const token = btoa(`${user.email}:${Date.now()}`);
    
    // Store auth data
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      Id: user.Id,
      email: user.email,
      name: user.name,
      role: user.role
    }));

    return {
      Id: user.Id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    const token = localStorage.getItem(STORAGE_KEY);
    const userData = localStorage.getItem(USER_KEY);
    
    if (token && userData) {
      return JSON.parse(userData);
    }
    
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};

export { authService };