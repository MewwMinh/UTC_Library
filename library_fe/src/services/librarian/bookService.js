// src/services/bookService.js
import apiClient from "../apiClient";

const bookService = {
  // Lấy danh sách sách
  getBooks: async () => {
    try {
      const response = await apiClient.get("/librarian/get-all-books");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  getBookDetail: async (bookId) => {
    try {
      const response = await apiClient.get(`/librarian/get-book/${bookId}`);

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật thông tin sách
  updateBook: async (bookId, bookData) => {
    try {
      const response = await apiClient.patch(
        `/librarian/change-book-info/${bookId}`,
        bookData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể cập nhật thông tin sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Thay đổi ảnh bìa sách
  changeBookCover: async (isbn, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/librarian/change-book-cover/${isbn}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Thay đổi ảnh thành công!",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể thay đổi ảnh bìa sách",
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
      };
    }
  },

  uploadBookCover: async (isbn, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/librarian/upload-book-cover/${isbn}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Thay đổi ảnh thành công!",
          result: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể thay đổi ảnh bìa sách",
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
      };
    }
  },

  // Thêm sách mới
  addBook: async (bookData) => {
    try {
      const response = await apiClient.post(
        "/librarian/add-book-to-lib",
        bookData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể thêm sách mới",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Xóa sách
  deleteBook: async (bookId) => {
    try {
      const response = await apiClient.delete(
        `/librarian/delete-book/${bookId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  deleteComment: async (reviewId) => {
    try {
      const response = await apiClient.delete(
        `/librarian/delete-book-review/${reviewId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Đã xóa bình luận thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa bình luận",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Lấy tất cả bản sao của một sách
  getBookItems: async (bookId) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-all-book-items/${bookId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể tải danh sách bản sao sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật thông tin bản sao sách
  updateBookItem: async (itemId, bookItemData) => {
    try {
      const response = await apiClient.post(
        `/librarian/change-book-item-info/${itemId}`,
        bookItemData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể cập nhật thông tin sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Xóa một bản sao sách
  deleteBookItem: async (itemId) => {
    try {
      const response = await apiClient.delete(
        `/librarian/delete-book-item/${itemId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Xóa nhiều bản sao sách
  deleteMultipleBookItems: async (itemIds) => {
    try {
      const response = await apiClient.post(
        "/librarian/delete-book-items",
        itemIds
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa nhiều sách",
          code: response.data.code,
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default bookService;
