import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { throttle, debounce } from "lodash";

import { useSocket } from "../context/SocketProvider";

export const useTyping = (receiver) => {
  const { socket } = useSocket();

  const { userInfo } = useSelector((state) => state.auth);

  const [isTyping, setIsTyping] = useState(false);

  const sendTypingEventRef = useRef();
  const sendStopTypingEventRef = useRef();

  useEffect(() => {
    if (!socket) return;

    sendTypingEventRef.current = throttle(() => {
      socket.emit("typingMessage", { receiver, sender: userInfo.id });
    }, 2000);

    sendStopTypingEventRef.current = debounce(() => {
      setIsTyping(false);
      socket.emit("stopTypingMessage", { receiver, sender: userInfo.id });
    }, 2500);
  }, [socket, receiver, userInfo?.id]);

  const handleTyping = useCallback(() => {
    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTypingEventRef.current();
    }

    sendStopTypingEventRef.current();
  }, [socket, isTyping]);

  return { handleTyping };
};
