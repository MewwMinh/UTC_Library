// src/services/patronService.js
import apiClient from "../apiClient";

const patronService = {
  // Lấy tất cả bạn đọc
  getAllPatrons: async () => {
    try {
      const response = await apiClient.get("/coordinator/get-all-patrons");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách bạn đọc",
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

  // Lấy thông tin chi tiết của bạn đọc
  getPatronDetails: async (patronID) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-patron-detail-by-id/${patronID}`
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

  // Lấy lịch sử mượn sách của bạn đọc
  getPatronBorrowHistory: async (patronID) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-patron-borrow-records-history/${patronID}`
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

  // Lấy lịch sử sử dụng phòng đọc
  getReadingRoomHistory: async (patronID) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-patron-using-reading-room-history/${patronID}`
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
            response.data.message || "Không thể tải lịch sử sử dụng phòng đọc",
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

  // Lấy lịch sử vi phạm
  getViolationHistory: async (patronID) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-patron-violations/${patronID}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải lịch sử vi phạm",
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

  updatePatronInfo: async (patronData) => {
    try {
      const response = await apiClient.post(
        "/coordinator/change-patron-infomation",
        patronData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message:
            response.data.message || "Cập nhật thông tin bạn đọc thành công",
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể cập nhật thông tin bạn đọc",
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

  // Tạo bạn đọc mới
  createPatron: async (patronData) => {
    try {
      const response = await apiClient.post(
        "/coordinator/create_patron",
        patronData
      );

      return response.data;
    } catch (error) {
      console.error("Error creating patron:", error);
      return {
        code: error.response?.data?.code || 0,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
      };
    }
  },
};

export default patronService;
