import { createSlice } from "@reduxjs/toolkit";
import { decodeJwtToken } from "../../utils/jwtUtils";

const initialState = {
  authenticated: false,
  token: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      const decodedToken = decodeJwtToken(action.payload);
      if (!decodedToken) {
        return initialState;
      }

      localStorage.setItem("authToken", action.payload);
      return {
        authenticated: true,
        token: action.payload,
        userInfo: decodedToken,
      };
    },
    logout: () => {
      localStorage.removeItem("authToken");
      return initialState;
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
