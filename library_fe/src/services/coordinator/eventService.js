import apiClient from "../apiClient";

const eventService = {
  // Lấy tất cả sự kiện
  getAllEvents: async () => {
    try {
      const response = await apiClient.get("/coordinator/get-all-events");

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

  // Get event details by ID
  getEventById: async (eventId) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-event-by-event-id/${eventId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin sự kiện",
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

  // Update event information
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await apiClient.post(
        `/coordinator/change-event-infomation/${eventId}`,
        eventData
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
            response.data.message || "Không thể cập nhật thông tin sự kiện",
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

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const response = await apiClient.delete(
        `/coordinator/delete-event/${eventId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa sự kiện",
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

  createEvent: async (eventData) => {
    try {
      const response = await apiClient.post(
        "/coordinator/create-event",
        eventData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
          code: response.data.code,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Error occurred while creating the event",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Event creation error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Unable to connect to server",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Lấy danh sách bạn đọc đã đăng ký tham gia sự kiện
  getEventParticipants: async (eventId) => {
    try {
      const response = await apiClient.get(
        `/coordinator/get-all-patron-registed/${eventId}`
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
            response.data.message || "Không thể tải danh sách người tham gia",
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

export default eventService;
