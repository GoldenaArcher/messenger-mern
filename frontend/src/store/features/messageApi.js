import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    postMessage: builder.mutation({
      query: (data) => ({
        url: "/message",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { usePostMessageMutation } = messageApi;
