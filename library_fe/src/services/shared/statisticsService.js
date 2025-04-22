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
};

export default statisticsService;

// export const fetchStatistics = async () => {
//   try {
//     const response = await apiClient.get("/manager/get-tong-hop-thong-ke");
//     if (response.data.code === 1000) {
//       return response.data.result;
//     } else {
//       throw new Error("Failed to fetch statistics");
//     }
//   } catch (error) {
//     throw new Error(
//       error.message || "An error occurred while fetching statistics"
//     );
//   }
// };
