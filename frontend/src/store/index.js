import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/authApi";
import authSlice from "./features/authSlice";
import logger from "redux-logger";
import { rehydrateJwtToken } from "../utils/jwtUtils";

const rehydratedAuthState = rehydrateJwtToken();

export default configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware().concat(userApi.middleware);

    middlewares.push(logger);

    return middlewares;
  },
  preloadedState: {
    auth: rehydratedAuthState,
  },
});
