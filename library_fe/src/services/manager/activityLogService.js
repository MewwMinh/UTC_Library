// src/services/activityLogService.js
import apiClient from "../apiClient";

const activityLogService = {
  // Lấy danh sách nhật ký hoạt động của nhân viên
  getActivityLogs: async (params) => {
    try {
      const response = await apiClient.get(
        "/manager/get-employee-activity-log",
        { params }
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải nhật ký hoạt động",
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

export default activityLogService;
