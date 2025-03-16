// src/services/borrowReturnService.js
import apiClient from "../apiClient";

const borrowReturnService = {
  // Lấy danh sách sách đang mượn
  getBorrowingBooks: async () => {
    try {
      const response = await apiClient.get("/patron/get-borrowing-books");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể tải danh sách sách đang mượn",
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

  // Lấy danh sách sách sắp đến hạn và quá hạn
  getNearAndOverDueBooks: async () => {
    try {
      const response = await apiClient.get(
        "/patron/get-near-and-over-due-books"
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
            response.data.message || "Không thể tải danh sách sách sắp đến hạn",
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

  // Lấy lịch sử mượn sách
  getBorrowHistory: async () => {
    try {
      const response = await apiClient.get(
        "/patron/get-borrow-records-history"
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải lịch sử mượn sách",
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
