import api from './api';

export const postService = {
    // ============ Public Endpoints ============

    // Get published posts with pagination
    getPosts: async (page = 1, perPage = 10) => {
        const response = await api.get('/posts', {
            params: { page, per_page: perPage },
        });
        return response.data;
    },

    // Get single post by slug
    getPostBySlug: async (slug) => {
        const response = await api.get(`/posts/${slug}`);
        return response.data;
    },

    // Get all tags
    getTags: async () => {
        const response = await api.get('/posts/tags');
        return response.data;
    },

    // Get posts by tag
    getPostsByTag: async (tagSlug, page = 1, perPage = 10) => {
        const response = await api.get(`/posts/tags/${tagSlug}`, {
            params: { page, per_page: perPage },
        });
        return response.data;
    },

    // ============ User Endpoints ============

    // Get posts for current user
    getUserPosts: async (page = 1, perPage = 10, status = null) => {
        const params = { page, per_page: perPage };
        if (status) params.status = status;
        const response = await api.get('/user/posts', { params });
        return response.data;
    },

    // Get single post by ID (user)
    getUserPostById: async (id) => {
        const response = await api.get(`/user/posts/${id}`);
        return response.data;
    },

    // Create post (user)
    createUserPost: async (postData) => {
        const response = await api.post('/user/posts', postData);
        return response.data;
    },

    // Update post (user)
    updateUserPost: async (id, postData) => {
        const response = await api.put(`/user/posts/${id}`, postData);
        return response.data;
    },

    // Delete post (user)
    deleteUserPost: async (id) => {
        const response = await api.delete(`/user/posts/${id}`);
        return response.data;
    },

    // Upload image (user)
    uploadUserImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/user/posts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // ============ Admin Endpoints ============

    // Get all posts (admin)
    getAllPosts: async (page = 1, perPage = 10, status = null) => {
        const params = { page, per_page: perPage };
        if (status) params.status = status;

        const response = await api.get('/admin/posts', { params });
        return response.data;
    },

    // Get post by ID (admin)
    getPostById: async (id) => {
        const response = await api.get(`/admin/posts/${id}`);
        return response.data;
    },

    // Create post
    createPost: async (postData) => {
        const response = await api.post('/admin/posts', postData);
        return response.data;
    },

    // Update post
    updatePost: async (id, postData) => {
        const response = await api.put(`/admin/posts/${id}`, postData);
        return response.data;
    },

    // Delete post
    deletePost: async (id) => {
        const response = await api.delete(`/admin/posts/${id}`);
        return response.data;
    },

    // Upload image
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/admin/posts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default postService;
