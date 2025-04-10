// src/services/violationService.js
import apiClient from "../apiClient";

const violationService = {
  // Lấy danh sách vi phạm
  getAllViolations: async () => {
    try {
      const response = await apiClient.get(
        "/librarian/get-all-patron-violation"
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể lấy danh sách vi phạm",
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

  // Lấy chi tiết vi phạm
  getViolationDetail: async (violationId) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-violation-detail/${violationId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể lấy chi tiết vi phạm",
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

  // Lấy số lượng vi phạm theo loại cho các khoảng thời gian khác nhau
  getViolationCountByType: async (period) => {
    try {
      const response = await apiClient.get(
        `/librarian/get_violation_count_by_type_this_${period}`
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
            response.data.message || "Không thể tải dữ liệu vi phạm theo loại",
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

  // Lấy số lượng vi phạm theo tháng trong một năm cụ thể
  getMonthlyViolationCountByYear: async (year) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-monthly-violation-count-by-year/${year}`
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
            response.data.message || "Không thể tải dữ liệu vi phạm theo tháng",
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

  // Lấy thông tin chi tiết vi phạm theo ID
  getViolationDetails: async (violationId) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-user-violation-by-violationID/${violationId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin vi phạm",
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

export default violationService;
