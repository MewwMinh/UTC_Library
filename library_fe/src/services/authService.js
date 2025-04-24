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

  // Get staff details
  getStaffDetails: async () => {
    try {
      const response = await apiClient.get("/manager/get-details-info");

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

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await apiClient.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể đổi mật khẩu",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Change avatar
  changeAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/auth/change-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể thay đổi ảnh đại diện",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default authService;
