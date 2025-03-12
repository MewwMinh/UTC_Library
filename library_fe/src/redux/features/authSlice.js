// src/redux/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "/src/services/authService";
import { jwtDecode } from "jwt-decode";

// Hàm trích xuất thông tin từ token
const extractTokenInfo = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      sub: decoded.sub, // UserId
      scope: decoded.scope, // Role
      exp: decoded.exp, // Expiration
    };
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

// Khởi tạo state ban đầu
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  scope: localStorage.getItem("scope"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  errorCode: null,
};

// Tạo async thunk cho đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(username, password);

      if (!response.success) {
        return rejectWithValue({
          message: response.message,
          code: response.code,
        });
      }

      const { token, refreshToken } = response.data;
      const tokenInfo = extractTokenInfo(token);

      return {
        token,
        refreshToken,
        scope: tokenInfo?.scope || null,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Đăng nhập thất bại",
        code: 0,
      });
    }
  }
);

// Tạo async thunk cho đăng xuất
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await authService.logout(token);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action creators thủ công cho Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.errorCode = null;
    },
    loginSuccess: (state, action) => {
      const { token, refreshToken, scope } = action.payload;
      state.loading = false;
      state.token = token;
      state.refreshToken = refreshToken;
      state.scope = scope;
      state.isAuthenticated = true;
      state.error = null;
      state.errorCode = null;

      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("scope", scope);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload;
      state.errorCode = action.payload?.code || null;
      state.isAuthenticated = false;
    },

    // Reducer xử lý refresh token thành công
    refreshTokenSuccess: (state, action) => {
      const { token, refreshToken } = action.payload;
      const tokenInfo = extractTokenInfo(token);

      // Cập nhật tokens
      state.token = token;
      state.refreshToken = refreshToken;
      state.scope = tokenInfo?.scope || state.scope;
      state.isAuthenticated = true;

      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      if (tokenInfo?.scope) {
        localStorage.setItem("scope", tokenInfo.scope);
      }
    },

    // Reset lỗi
    clearError: (state) => {
      state.error = null;
      state.errorCode = null;
    },

    // Đăng xuất thủ công (không gọi API)
    logoutManual: (state) => {
      // Reset state
      state.loading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.scope = null;
      state.isAuthenticated = false;
      state.error = null;
      state.errorCode = null;

      // Xóa khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("scope");
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.scope = action.payload.scope;
        state.isAuthenticated = true;
        state.error = null;
        state.errorCode = null;

        // Lưu vào localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("scope", action.payload.scope);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng nhập thất bại";
        state.errorCode = action.payload?.code || null;
      })

      // Xử lý logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // Reset state
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.scope = null;
        state.isAuthenticated = false;

        // Xóa khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("scope");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // Vẫn đăng xuất ở phía client ngay cả khi API lỗi
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.scope = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("scope");
      });
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  refreshTokenSuccess,
  clearError,
  logoutManual,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectScope = (state) => state.auth.scope;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthErrorCode = (state) => state.auth.errorCode;

// Export reducer
export default authSlice.reducer;
