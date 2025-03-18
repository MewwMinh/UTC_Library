// src/api/apiClient.js
import axios from "axios";
// Không import store trực tiếp
// import {
//   refreshTokenSuccess,
//   logoutManual,
// } from "/src/redux/features/authSlice";

// Tạo instance Axios với cấu hình chung
const apiClient = axios.create({
  baseURL: "http://localhost:8088",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout 10 giây
});

// Biến để kiểm soát refresh token đang được xử lý
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý khi refresh token thành công
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor cho request - Thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Sử dụng trực tiếp localStorage thay vì store
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response - Xử lý refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có response từ server, trả về lỗi
    if (!error.response) {
      return Promise.reject(error);
    }

    // Kiểm tra nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh thì thêm request hiện tại vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Lấy refreshToken từ localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu không có refresh token
      if (!refreshToken) {
        processQueue(new Error("No refresh token"));
        // Xóa dữ liệu localStorage thay vì dispatch action
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("scope");
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.post(
          "http://localhost:8088/auth/refresh-token",
          { token: refreshToken }
        );

        if (response.data.code === 1000) {
          const { token, refreshToken: newRefreshToken } = response.data.result;
          console.log("Refresh token");

          // Lưu token mới vào localStorage thay vì dispatch action
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Xử lý queue
          processQueue(null, token);

          // Cập nhật token trong header
          originalRequest.headers.Authorization = `Bearer ${token}`;

          isRefreshing = false;

          // Gọi lại request ban đầu với token mới
          return apiClient(originalRequest);
        } else {
          // Nếu refresh token thất bại
          processQueue(new Error("Failed to refresh token"));
          // Xóa dữ liệu localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("scope");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại
        processQueue(refreshError);
        // Xóa dữ liệu localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("scope");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
