import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/authApi";
import authSlice from "./features/authSlice";
import logger from "redux-logger";
import { rehydrateJwtToken } from "../utils/jwtUtils";
import { friendApi } from "./features/friendApi";
import { messageApi } from "./features/messageApi";

const rehydratedAuthState = rehydrateJwtToken();

export default configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [friendApi.reducerPath]: friendApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware().concat(
      userApi.middleware,
      friendApi.middleware,
      messageApi.middleware
    );

    middlewares.push(logger);

    return middlewares;
  },
  preloadedState: {
    auth: rehydratedAuthState,
  },
});
