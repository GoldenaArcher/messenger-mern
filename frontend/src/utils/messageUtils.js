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
          { friendList: friendList.map((friend) => friend._id) },
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
