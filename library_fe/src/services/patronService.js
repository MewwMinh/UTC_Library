import apiClient from "./apiClient";

const patronService = {
  // Lấy thông tin người dùng
  getPatronInfo: async () => {
    try {
      const response = await apiClient.get("/patron/get-patron-information");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể tải thông tin người dùng",
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

  getRecentBorrowedBooks: async () => {
    try {
      const response = await apiClient.get("/patron/get-5-recent-borrow-books");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể tải danh sách sách đã mượn",
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

  getPatronStatistics: async () => {
    try {
      const response = await apiClient.get("/patron/get-patron-statistics");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thống kê người dùng",
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

  getBookDetails: async (bookId) => {
    try {
      const response = await apiClient.get(
        `/patron/get-book-details/${bookId}`
      );

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

  // Thêm sách vào danh sách yêu thích
  addToFavorites: async (bookID) => {
    try {
      const response = await apiClient.post("/patron/add-to-favorites", {
        bookID,
      });

      if (response.data.code === 1000) {
        return {
          success: true,
          message: "Đã thêm vào danh sách yêu thích",
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể thêm vào danh sách yêu thích",
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

  // Xóa sách khỏi danh sách yêu thích
  removeFromFavorites: async (bookID) => {
    try {
      const response = await apiClient.post("/patron/remove-from-favorites", {
        bookID,
      });

      if (response.data.code === 1000) {
        return {
          success: true,
          message: "Đã xóa khỏi danh sách yêu thích",
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể xóa khỏi danh sách yêu thích",
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

  // Đặt mượn sách
  reserveBook: async (bookID, pickupDate) => {
    try {
      const response = await apiClient.post("/patron/reserve-book", {
        bookID,
        pickupDate,
      });

      if (response.data.code === 1000) {
        return {
          success: true,
          message: "Đặt mượn sách thành công",
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể đặt mượn sách",
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

  // Kiểm tra sách có trong danh sách yêu thích không
  checkFavorite: async (bookId) => {
    try {
      const response = await apiClient.get(`/patron/check-favorite/${bookId}`);

      return {
        success: true,
        isFavorite: response.data,
      };
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return {
        success: false,
        isFavorite: false,
      };
    }
  },

  // Lấy danh sách đánh giá của một cuốn sách
  getBookReviews: async (bookId) => {
    try {
      const response = await apiClient.get(
        `/patron/get-book-reviews/${bookId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải đánh giá sách",
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

  submitBookReview: async (bookID, rating, comment) => {
    try {
      const response = await apiClient.post("/patron/review-book", {
        bookID,
        rating,
        comment,
      });

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể gửi đánh giá",
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

  // Tìm kiếm sách theo từ khóa
  searchBooks: async (keyword) => {
    try {
      const response = await apiClient.get(
        `/patron/find-books-by-keyword/${keyword}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tìm kiếm sách",
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

  // Lấy sách gợi ý
  getSuggestedBooks: async () => {
    try {
      const response = await apiClient.get("/patron/get-suggestion-books");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể lấy sách gợi ý",
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

  // Lấy sách công nghệ
  getTechBooks: async () => {
    try {
      const response = await apiClient.get("/patron/get-tech-books");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể lấy sách công nghệ",
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

export default patronService;
