// src/services/eventService.js
import apiClient from "../apiClient";

const eventService = {
  // Get all library events
  getAllEvents: async () => {
    try {
      const response = await apiClient.get("/patron/get-all-events");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách sự kiện",
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

  // Get all events registered by the current user
  getRegisteredEvents: async () => {
    try {
      const response = await apiClient.get("/patron/get-all-attended-events");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải sự kiện đã đăng ký",
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

  // Register for an event
  registerEvent: async (eventID) => {
    try {
      const response = await apiClient.post("/patron/register-event", {
        eventID,
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
          error.response?.data?.message || "Không thể đăng ký tham gia sự kiện",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cancel registration for an event
  unregisterEvent: async (eventID) => {
    try {
      const response = await apiClient.post("/patron/unregister-event", {
        eventID,
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
          error.response?.data?.message || "Không thể hủy đăng ký sự kiện",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default eventService;
