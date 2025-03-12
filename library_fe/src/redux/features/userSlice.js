// src/redux/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "/src/services/userService";

// Khởi tạo state ban đầu
const initialState = {
  userInfo: {
    userID: "",
    userName: "",
    userImage: null,
  },
  loading: false,
  error: null,
};

// Tạo async thunk để lấy thông tin người dùng
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserInfo();

      if (!response.success) {
        return rejectWithValue({
          message: response.message,
          code: response.code,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Không thể lấy thông tin người dùng",
        code: 0,
      });
    }
  }
);

// Tạo slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reset thông tin người dùng khi đăng xuất
    resetUserInfo: (state) => {
      state.userInfo = {
        userID: "",
        userName: "",
        userImage: null,
      };
      state.loading = false;
      state.error = null;
    },

    // Thiết lập thông tin người dùng thủ công (nếu cần)
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserInfo
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đã xảy ra lỗi";
      });
  },
});

// Export actions
export const { resetUserInfo, setUserInfo } = userSlice.actions;

// Export selectors
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

// Export reducer
export default userSlice.reducer;
