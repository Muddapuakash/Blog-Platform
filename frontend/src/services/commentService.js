import api from './api';

const commentService = {
  // ======================================================
  // PUBLIC / GUEST
  // ======================================================

  // Get approved comments for a post (public)
  getApprovedComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Submit guest comment
  submitGuestComment: async (postId, guest_name, guest_email, content) => {
    const response = await api.post(`/posts/${postId}/comments`, {
      guest_name,
      guest_email,
      content
    });
    return response.data;
  },

  // ======================================================
  // USER (AUTHENTICATED)
  // ======================================================

  // Submit comment as logged-in user
  submitUserComment: async (postId, content) => {
    const response = await api.post(`/user/posts/${postId}/comments`, {
      content
    });
    return response.data;
  },

  // Get logged-in user's comments
  getUserComments: async (page = 1, perPage = 20) => {
    const response = await api.get('/comments/my', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },

  // Update user's own comment
  updateUserComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  // Delete user's own comment
  deleteUserComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // ======================================================
  // ADMIN
  // ======================================================

  // Get all comments (admin)
  getAllComments: async (page = 1, perPage = 20, status = null) => {
    const params = { page, per_page: perPage };
    if (status) params.status = status;

    const response = await api.get('/admin/comments', { params });
    return response.data;
  },

  // Admin edit comment content
  updateCommentAdmin: async (commentId, content) => {
    const response = await api.put(
      `/admin/comments/${commentId}/edit`,
      { content }
    );
    return response.data;
  },

  // Admin approve / reject comment
  moderateComment: async (commentId, action) => {
    const response = await api.put(
      `/admin/comments/${commentId}`,
      { action } // action = 'approve' | 'reject'
    );
    return response.data;
  },

  // Admin delete comment
   deleteCommentAdmin: async (commentId) => {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return response.data;
  }
};

export default commentService;
