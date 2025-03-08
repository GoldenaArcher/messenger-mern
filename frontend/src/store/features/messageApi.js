import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../../utils/axiosBaseQuery";
import { friendApi } from "./friendApi";
import {
  updateMessageCache,
  updateMessagesStatusCache,
  updateMessageStatusCache,
} from "../../utils/messageUtils";
import { getEntityIds } from "../../utils/entityUtils";

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
      query: ({ friendList }) => {
        if (!friendList || !Array.isArray(friendList)) {
          throw new Error(
            "friendList passed to fetchLastFriendMessages must be an array"
          );
        }

        let friends = friendList;

        if (typeof friendList[0] !== "string") {
          friends = getEntityIds(friendList);
        }

        return {
          url: `/messages/recent`,
          method: "GET",
          params: {
            friends,
          },
        };
      },
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
        await updateMessageStatusCache({
          queryFulfilled,
          dispatch,
          getState,
          messageApi,
          friendApi,
        });
      },
    }),
    updateMessagesStatus: builder.mutation({
      query: ({ messageIds, status }) => {
        return {
          url: `/messages/status`,
          method: "PATCH",
          data: { status, messageIds: getEntityIds(messageIds) },
        };
      },
      transformResponse: (res) => res.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        await updateMessagesStatusCache({
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
  useUpdateMessagesStatusMutation,
} = messageApi;
