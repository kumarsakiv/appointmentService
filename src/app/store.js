// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch (e) {
    return null;
  }
})();

const preloadedState = saved
  ? {
      auth: {
        user: saved.user || null,
        role: saved.role || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    }
  : {};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export default store;
