import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";
import { setAuthToken } from "../features/authSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/messenger/user-register",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthToken(data.token));
        } catch (error) {
          console.error("Error storing JWT:", error);
        }
      },
    }),
  }),
});

export const { useRegisterUserMutation } = userApi;
