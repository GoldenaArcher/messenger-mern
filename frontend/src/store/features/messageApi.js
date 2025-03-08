import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../../utils/axiosBaseQuery";
import { friendApi } from "./friendApi";
import { updateMessageCache } from "../../utils/messageUtils";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    postMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        data,
      }),
      transformResponse: (res) => res.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        await updateMessageCache({
          queryFulfilled,
          dispatch,
          getState,
          messageApi,
          friendApi,
        });
      },
    }),
    fetchMessages: builder.query({
      query: ({ sender, receiver }) => ({
        url: `/messages`,
        method: "GET",
        params: {
          sender,
          receiver,
        },
      }),
      transformResponse: (res) => res.data,
    }),
    fetchLastFriendMessages: builder.query({
      query: ({ friendList }) => ({
        url: `/messages/recent`,
        method: "GET",
        params: {
          friends: friendList,
        },
      }),
      transformResponse: (res) => res.data,
    }),
    updateMessageStatus: builder.mutation({
      query: ({ messageId, status }) => ({
        url: `/messages/${messageId}/status`,
        method: "PATCH",
        data: { status },
      }),
      transformResponse: (res) => res.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        await updateMessageCache({
          queryFulfilled,
          dispatch,
          getState,
          messageApi,
          friendApi,
        });
      },
    }),
  }),
});

export const {
  usePostMessageMutation,
  useFetchMessagesQuery,
  useFetchLastFriendMessagesQuery,
  useUpdateMessageStatusMutation,
} = messageApi;
