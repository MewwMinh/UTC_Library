import apiClient from "./apiClient";

const librarianService = {
  // Lấy hoạt động gần đây của bạn đọc
  getRecentActivities: async () => {
    try {
      const response = await apiClient.get(
        "/librarian/get-some-patron-reason-activities"
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải hoạt động gần đây",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },
  getWeeklyBorrowReturn: async () => {
    try {
      const response = await apiClient.get(
        "/librarian/get-borrow-return-weekly"
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải dữ liệu thống kê",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Error fetching weekly borrow/return data:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  getPatronInformation: async (patronId) => {
    try {
      const response = await apiClient.get(
        `/librarian/get-patron-information/${patronId}`
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
      console.error("Error fetching patron information:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Thêm các dịch vụ khác dành cho librarian ở đây
};

export default librarianService;
