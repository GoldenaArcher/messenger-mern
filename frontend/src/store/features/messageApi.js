import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "../../utils/axiosBaseQuery";
import { friendApi } from "./friendApi";

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
        try {
          const { data } = await queryFulfilled;
          dispatch(
            messageApi.util.updateQueryData(
              "fetchMessages",
              { sender: data.sender, receiver: data.receiver },
              (messageList) => {
                messageList.push(data);
              }
            )
          );

          const friendsState = getState()[friendApi.reducerPath];
          const friendList =
            friendsState?.queries?.["fetchFriends(undefined)"]?.data || [];

          if (friendList.length > 0) {
            dispatch(
              messageApi.util.updateQueryData(
                "fetchLastFriendMessages",
                { friendList: friendList.map((friend) => friend._id) },
                (lastMessages) => {
                  const existingIndex = lastMessages.findIndex(
                    (msg) =>
                      (msg.sender === data.sender &&
                        msg.receiver === data.receiver) ||
                      (msg.sender === data.receiver &&
                        msg.receiver === data.sender)
                  );

                  if (existingIndex !== -1) {
                    lastMessages[existingIndex] = data;
                  } else {
                    lastMessages.push(data);
                  }
                }
              )
            );
          }
        } catch (error) {
          console.error("Error authenticating user:", error);
        }
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
  }),
});

export const {
  usePostMessageMutation,
  useFetchMessagesQuery,
  useFetchLastFriendMessagesQuery,
} = messageApi;
