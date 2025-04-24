import apiClient from "../apiClient";

const statisticsService = {
  fetchStatistics: async () => {
    try {
      const response = await apiClient.get("/manager/get-tong-hop-thong-ke");
      if (response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Failed to fetch statistics");
      }
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while fetching statistics"
      );
    }
  },
  // Lấy dữ liệu phân loại người dùng
  fetchUserCategoryData: async () => {
    try {
      const response = await apiClient.get("/manager/get-phan-loai-nguoi-dung");
      if (response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Failed to fetch user category data");
      }
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while fetching user category data"
      );
    }
  },

  // Lấy dữ liệu phân bố hạng thành viên
  fetchMembershipLevelData: async () => {
    try {
      const response = await apiClient.get(
        "/manager/get-thong-ke-hang-thanh-vien"
      );
      if (response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Failed to fetch membership level data");
      }
    } catch (error) {
      throw new Error(
        error.message ||
          "An error occurred while fetching membership level data"
      );
    }
  },

  // Lấy thống kê mượn/trả sách 5 năm gần đây
  getBookStatisticsLast5Years: async () => {
    try {
      const response = await apiClient.get(
        "/manager/get-thong-ke-muon-tra-5-nam-gan-day"
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
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  getBorrowReturnStatsByYear: async (year) => {
    try {
      const response = await apiClient.get(
        `/manager/get-thong-ke-muon-tra-theo-nam/${year}`
      );

      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error in getBorrowReturnStatsByYear:", error);
      throw error;
    }
  },

  getLibraryUsageByYear: async (year) => {
    try {
      const response = await apiClient.get(
        `/manager/get-thong-ke-nhu-cau-su-dung-thu-vien-theo-nam/${year}`
      );

      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error in getLibraryUsageByYear:", error);
      throw error;
    }
  },

  getLibraryUsageByMonth: async (year, month) => {
    try {
      const response = await apiClient.get(
        `/manager/get-thong-ke-nhu-cau-su-dung-thu-vien-theo-thang/${year}/${month}`
      );

      if (response.data && response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error in getLibraryUsageByMonth:", error);
      throw error;
    }
  },

  // Lấy top 10 sách được mượn nhiều nhất theo tháng
  getTopBorrowedBooksByMonth: async (year, month) => {
    try {
      const response = await apiClient.get(
        `/manager/get-top-10-sach-duoc-muon-nhieu-nhat-theo-thang/${year}/${month}`
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
            response.data.message || "Không thể tải dữ liệu thống kê sách",
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

export default statisticsService;
