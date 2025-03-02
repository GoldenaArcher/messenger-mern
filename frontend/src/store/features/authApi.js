import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";
import { setAuthToken } from "../features/authSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user-register",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthToken(data.data.token));
        } catch (error) {
          console.error("Error authenticating user:", error);
        }
      },
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/user-login",
        method: "POST",
        data: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthToken(data.data.token));
        } catch (error) {
          console.error("Error authenticating user:", error);
        }
      },
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = userApi;
