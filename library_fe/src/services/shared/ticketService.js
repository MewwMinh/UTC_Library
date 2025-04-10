// src/services/ticketService.js
import apiClient from "../apiClient";

const ticketService = {
  // Lấy thống kê yêu cầu hỗ trợ
  getTicketStatistics: async () => {
    try {
      const response = await apiClient.get("/librarian/get-ticket-statistic");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thống kê yêu cầu",
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

  // Lấy danh sách yêu cầu hỗ trợ
  getAllHelpTickets: async () => {
    try {
      const response = await apiClient.get("/librarian/get-all-help-tickets");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể tải danh sách yêu cầu hỗ trợ",
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

  getTicketDetails: async (ticketID) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-help-ticket-details/${ticketID}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin yêu cầu",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  /**
   * Lấy danh sách phản hồi cho một yêu cầu hỗ trợ
   * @param {string} ticketID - ID của yêu cầu cần lấy phản hồi
   * @returns {Promise<Object>} Kết quả từ API
   */
  getTicketResponses: async (ticketID) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-response-ticket/${ticketID}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result || [],
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách phản hồi",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error fetching ticket responses:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  /**
   * Gửi phản hồi cho một yêu cầu hỗ trợ
   * @param {string} ticketID - ID của yêu cầu cần phản hồi
   * @param {Object} responseData - Dữ liệu phản hồi
   * @returns {Promise<Object>} Kết quả từ API
   */
  respondToTicket: async (ticketID, responseData) => {
    try {
      const response = await apiClient.post(
        `/librarian/reply-to-support-request/${ticketID}`,
        responseData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message || "Phản hồi thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể gửi phản hồi",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error responding to ticket:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },
};

export default ticketService;
