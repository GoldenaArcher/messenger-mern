const MAX_LENGTH = 25;

export const trimMessage = (text, maxLength = MAX_LENGTH) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const updateMessageCache = async ({
  queryFulfilled,
  messageApi,
  friendApi,
  getState,
  dispatch,
}) => {
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
          { friendList },
          (lastMessages) => {
            const existingIndex = lastMessages.findIndex(
              (msg) =>
                (msg.sender === data.sender &&
                  msg.receiver === data.receiver) ||
                (msg.sender === data.receiver && msg.receiver === data.sender)
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
};

export const applyMessageStatusUpdate = ({
  updatedMessages,
  messageApi,
  friendApi,
  getState,
  dispatch,
}) => {
  if (!updatedMessages) return;

  try {
    const messagesToUpdate = Array.isArray(updatedMessages)
      ? updatedMessages
      : [updatedMessages];

    messagesToUpdate.forEach((updatedMessage) => {
      dispatch(
        messageApi.util.updateQueryData(
          "fetchMessages",
          { sender: updatedMessage.sender, receiver: updatedMessage.receiver },
          (messageList) => {
            const message = messageList.find(
              (msg) => msg._id === updatedMessage._id
            );
            if (message) {
              message.status = updatedMessage.status;
            }
          }
        )
      );
    });

    const friendsState = getState()[friendApi.reducerPath];
    const friendList =
      friendsState?.queries?.["fetchFriends(undefined)"]?.data || [];

    if (friendList.length > 0) {
      dispatch(
        messageApi.util.updateQueryData(
          "fetchLastFriendMessages",
          { friendList },
          (lastMessages) => {
            messagesToUpdate.forEach((updatedMessage) => {
              const existingIndex = lastMessages.findIndex(
                (msg) => msg._id === updatedMessage._id
              );
              if (existingIndex !== -1) {
                lastMessages[existingIndex].status = updatedMessage.status;
              }
            });
          }
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateMessageStatusCache = async ({
  queryFulfilled,
  messageApi,
  friendApi,
  getState,
  dispatch,
}) => {
  try {
    const { data: updatedMessage } = await queryFulfilled;
    applyMessageStatusUpdate({
      updatedMessages: updatedMessage,
      messageApi,
      friendApi,
      getState,
      dispatch,
    });
  } catch (error) {
    console.error("Error updating message status cache:", error);
  }
};

export const updateMessagesStatusCache = async ({
  queryFulfilled,
  messageApi,
  friendApi,
  getState,
  dispatch,
}) => {
  try {
    const { data: updatedMessages } = await queryFulfilled;

    applyMessageStatusUpdate({
      updatedMessages,
      messageApi,
      friendApi,
      getState,
      dispatch,
    });
  } catch (error) {
    console.error("Error updating multiple messages status cache:", error);
  }
};
