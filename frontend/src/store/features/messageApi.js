import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";

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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
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
        } catch (error) {
          console.error("Error authenticating user:", error);
        }
      },
    }),
    fetchMessages: builder.query({
      query: ({ sender, receiver }) => ({
        url: `/messages?sender=${sender}&receiver=${receiver}`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { usePostMessageMutation, useFetchMessagesQuery } = messageApi;
