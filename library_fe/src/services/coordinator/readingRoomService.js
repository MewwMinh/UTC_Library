// src/services/readingRoomService.js
import apiClient from "../apiClient";

const readingRoomService = {
  // Lấy danh sách bạn đọc đang ở trong phòng đọc
  getPatronsInReadingRoom: async () => {
    try {
      const response = await apiClient.get(
        "/coordinator/get-patrons-in-reading-room"
      );

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

  // Check-in bạn đọc
  checkInPatron: async (patronID) => {
    try {
      const response = await apiClient.post(
        `/coordinator/check-in-patron/${patronID}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Check-in thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Check-in thất bại",
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

  // Check-out bạn đọc
  checkOutPatron: async (recordID) => {
    try {
      const response = await apiClient.post(
        `/coordinator/check-out-patron/${recordID}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Check-out thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Check-out thất bại",
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

export default readingRoomService;
