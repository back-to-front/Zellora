import api from './axios';

export const userService = {
  login: async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    return data;
  },

  register: async (username, email, password) => {
    const { data } = await api.post('/users', { username, email, password });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
  },

  deleteProfile: async () => {
    const { data } = await api.delete('/users/profile');
    return data;
  },
};

export const adminService = {
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  getDashboardStats: async () => {
    const { data } = await api.get('/users/dashboard');
    return data;
  },

  deleteUser: async (userId) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  suspendUser: async (userId, suspensionData) => {
    const { data } = await api.put(`/users/${userId}/suspend`, suspensionData);
    return data;
  },

  unsuspendUser: async (userId) => {
    const { data } = await api.put(`/users/${userId}/unsuspend`);
    return data;
  },

  updateUserRole: async (userId, roleData) => {
    const { data } = await api.put(`/users/${userId}/role`, roleData);
    return data;
  },
};
