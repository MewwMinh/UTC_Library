import apiClient from "../apiClient";

const requestService = {
  // Lấy tất cả yêu cầu hỗ trợ của người dùng hiện tại
  getRequests: async () => {
    try {
      const response = await apiClient.get("/patron/get-request");

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách yêu cầu",
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

  // Lấy chi tiết của một yêu cầu cụ thể
  getRequestDetail: async (requestId) => {
    try {
      const response = await apiClient.get(`/patron/get-request/${requestId}`);

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải chi tiết yêu cầu",
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

  // Lấy các phản hồi cho một yêu cầu cụ thể
  getRequestResponses: async (requestId) => {
    try {
      const response = await apiClient.get(
        `/patron/get-responses/${requestId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải phản hồi",
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

  // Gửi một yêu cầu hỗ trợ mới
  sendRequest: async (requestData) => {
    try {
      const response = await apiClient.post(
        "/patron/send-request",
        requestData
      );

      if (response.data) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể gửi yêu cầu",
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

export default requestService;
