// src/services/orderService.js
import apiClient from "../apiClient";

const orderService = {
  // Book Reservations
  getAllBookReservations: async () => {
    try {
      const response = await apiClient.get("/patron/get-all-book-reservation");
      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách đặt sách",
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

  cancelBookReservation: async (id) => {
    try {
      const response = await apiClient.post(
        `/patron/cancel-book-reservation/${id}`
      );
      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể hủy đặt sách",
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

  // Seat Reservations
  getAllSeatReservations: async () => {
    try {
      const response = await apiClient.get("/patron/get-all-seat-reservation");
      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách đặt chỗ",
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

  reserveSeat: async (seatData) => {
    try {
      const response = await apiClient.post("/patron/reserve-seat", seatData);
      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể đặt chỗ",
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

  cancelSeatReservation: async (id) => {
    try {
      const response = await apiClient.post(
        `/patron/cancel-seat-reservation/${id}`
      );
      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể hủy đặt chỗ",
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

export default orderService;
