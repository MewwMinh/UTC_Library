// src/services/employeeService.js
import apiClient from "../apiClient";

const employeeService = {
  // Lấy danh sách tất cả nhân viên
  getAllEmployees: async (params = {}) => {
    try {
      const response = await apiClient.get("/manager/get-all-employees", {
        params,
      });

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải danh sách nhân viên",
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

  // Lấy thông tin nhân viên theo ID
  getEmployeeById: async (userId) => {
    try {
      const response = await apiClient.get(
        `/manager/get-employee-by-user-id/${userId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải thông tin nhân viên",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhân viên:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (userId, employeeData) => {
    try {
      const response = await apiClient.post(
        `/manager/update-employee/${userId}`,
        employeeData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message:
            response.data.message || "Không thể cập nhật thông tin nhân viên",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nhân viên:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Xóa nhân viên
  deleteEmployee: async (userId) => {
    try {
      const response = await apiClient.delete(
        `/manager/delete-employee/${userId}`
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể xóa nhân viên",
          code: response.data.code,
        };
      }
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể kết nối đến máy chủ",
        code: error.response?.data?.code || 0,
      };
    }
  },

  // Tạo nhân viên mới
  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post(
        "/manager/create-employee",
        employeeData
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          data: response.data.result,
          message: "Tạo nhân viên thành công",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tạo nhân viên mới",
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

  // Upload ảnh đại diện của nhân viên
  uploadEmployeeAvatar: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/manager/upload-employee-avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 1000) {
        return {
          success: true,
          imageUrl: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Không thể tải lên ảnh đại diện",
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

  // Tạo mã nhân viên ngẫu nhiên
  generateEmployeeId: () => {
    // Tạo chuỗi gồm 9 số ngẫu nhiên, bắt đầu bằng số 6
    let employeeId = "6";
    for (let i = 0; i < 8; i++) {
      employeeId += Math.floor(Math.random() * 10);
    }
    return employeeId;
  },
};

export default employeeService;
