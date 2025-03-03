import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";

export const friendApi = createApi({
  reducerPath: "friendApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    fetchFriends: builder.query({
      query: () => ({
        url: "/friends",
        method: "GET",
      }),
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useFetchFriendsQuery } = friendApi;
