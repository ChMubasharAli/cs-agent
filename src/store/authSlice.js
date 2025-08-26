import { createSlice } from "@reduxjs/toolkit";

// Safely parse localStorage items with fallback
const storedUserData = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : null;
const storedAuthStatus = localStorage.getItem("authStatus")
  ? JSON.parse(localStorage.getItem("authStatus"))
  : false;
const token = localStorage.getItem("token") || null;

const initialState = {
  authStatus: storedAuthStatus || false,
  userData: storedUserData || null,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // Validate payload
      if (action.payload && action.payload.userData && action.payload.token) {
        state.authStatus = true;
        state.userData = action.payload.userData;
        state.token = action.payload.token;

        // Save to localStorage
        localStorage.setItem("authStatus", JSON.stringify(true));
        localStorage.setItem(
          "userData",
          JSON.stringify(action.payload.userData)
        );
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      }
    },
    logout: (state) => {
      state.authStatus = false;
      state.userData = null;
      state.token = null;

      // Remove from localStorage
      localStorage.removeItem("authStatus");
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
