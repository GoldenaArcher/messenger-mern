import { useUpdateMessageStatusMutation } from "../store/features/messageApi";

const useMessageStatus = () => {
  const [updateMessageStatus] = useUpdateMessageStatusMutation();

  const markAsDelivered = async (messageId) => {
    await updateMessageStatus({ messageId, status: "delivered" });
  };

  const markAsRead = async (messageId) => {
    await updateMessageStatus({ messageId, status: "read" });
  };

  return { markAsDelivered, markAsRead };
};

export default useMessageStatus;
