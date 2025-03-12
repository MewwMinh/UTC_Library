// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // Add other reducers here as your app grows
  },
});

export default store;
