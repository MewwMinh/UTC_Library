// src/services/userService.js
import apiClient from "./apiClient";

const userService = {
  // Lấy thông tin cơ bản của người dùng
  getUserInfo: async () => {
    try {
      const response = await apiClient.get("/auth/get-common-information");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể lấy thông tin người dùng",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin người dùng",
        code: error.response?.data?.code || 0,
      };
    }
  },

  getTopUsers: async () => {
    try {
      const response = await apiClient.get("/patron/get-top-10-user");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể lấy danh sách top người dùng",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách top người dùng:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  getTopBooks: async () => {
    try {
      const response = await apiClient.get("/patron/get-top-10-book");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể lấy danh sách sách phổ biến",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách phổ biến:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default userService;
