// src/services/borrowReturnService.js
import apiClient from "../apiClient";

const borrowReturnService = {
  // Lấy thông tin bạn đọc và sách đang mượn
  getPatronBorrowInfo: async (patronId) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-patron-borrow-information/${patronId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin bạn đọc",
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

  // Thực hiện cho mượn sách
  lendBooks: async (data) => {
    try {
      const response = await apiClient.post("/librarian/lend-book", data);

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Cho mượn sách thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Cho mượn sách thất bại",
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

  // Lấy thông tin sách bằng mã sách
  getBookByCode: async (bookCode) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-book-by-code/${bookCode}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không tìm thấy thông tin sách",
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

export default borrowReturnService;
