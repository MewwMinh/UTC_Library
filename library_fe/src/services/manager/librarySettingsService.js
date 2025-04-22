// src/services/librarySettingsService.js
import apiClient from "../apiClient";

const librarySettingsService = {
  // Lấy tất cả các cài đặt thư viện
  getAllSettings: async () => {
    try {
      const response = await apiClient.get("/manager/get-all-library-setting");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải cấu hình thư viện",
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

  // Cập nhật cài đặt thưởng phạt
  updateRewardsAndPenaltiesSettings: async (settings) => {
    try {
      const response = await apiClient.post(
        "/manager/rewardsAndPenaltiesSettings",
        settings
      );

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật cấu hình",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật cài đặt phí trễ hạn
  updateLateFeeSettings: async (settings) => {
    try {
      const response = await apiClient.post(
        "/manager/lateFeeSettings",
        settings
      );

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật cấu hình",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật cài đặt giới hạn mượn sách
  updateBorrowingLimitsSettings: async (settings) => {
    try {
      const response = await apiClient.post(
        "/manager/borrowingLimitsSettings",
        settings
      );

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật cấu hình",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật cài đặt thời gian mượn sách
  updateBorrowingPeriodSettings: async (settings) => {
    try {
      const response = await apiClient.post(
        "/manager/borrowingPeriodSettings",
        settings
      );

      return {
        success: response.data.code === 1000,
        message: response.data.message,
        code: response.data.code,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Không thể cập nhật cấu hình",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default librarySettingsService;
