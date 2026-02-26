import api from './api';

const authService = {
    /* ============================
       AUTHENTICATION
    ============================ */

    // User login
    userLogin: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // User register
    userRegister: async (email, username, password) => {
        const response = await api.post('/auth/register', {
            email,
            username,
            password
        });
        return response.data;
    },

    // Admin login
    adminLogin: async (email, password) => {
        const response = await api.post('/auth/admin/login', { email, password });
        return response.data;
    },

    // Admin register
    adminRegister: async (email, username, password, adminCode) => {
        const response = await api.post('/auth/admin/register', {
            email,
            username,
            password,
            admin_code: adminCode
        });
        return response.data;
    },

    /* ============================
       DASHBOARD
    ============================ */

    getDashboard: async () => {
        const user = authService.getUser();

        if (user?.is_admin) {
            const response = await api.get('/admin/dashboard');
            return response.data;
        } else {
            const response = await api.get('/user/dashboard');
            return response.data;
        }
    },

    /* ============================
       ADMIN – USERS MANAGEMENT
    ============================ */

    // Get all users (admin)
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Delete user (admin)
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    /* ============================
       AUTH STORAGE
    ============================ */

    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getUser();
        return user?.is_admin === true;
    }
};

export default authService;
