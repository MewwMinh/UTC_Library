// src/api/authService.js
import apiClient from "./apiClient";

const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      // Kiểm tra code trả về từ API
      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
          code: response.data.code,
        };
      } else {
        // Nếu code khác 1000, coi như lỗi với message từ server
        return {
          success: false,
          message: response.data.message,
          code: response.data.code,
        };
      }
    } catch (error) {
      // Xử lý khi API trả về lỗi HTTP
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập không thành công",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Đăng xuất
  logout: async (token) => {
    try {
      await apiClient.post("/auth/log-out", { token });
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      // Vẫn trả về success để xóa token ở client
      return { success: true };
    }
  },

  // Kiểm tra token hợp lệ
  introspectToken: async (token) => {
    try {
      const response = await apiClient.post(`/auth/introspect/${token}`);
      return {
        success: true,
        isValid: response.data,
      };
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return {
        success: false,
        isValid: false,
      };
    }
  },
};

export default authService;
