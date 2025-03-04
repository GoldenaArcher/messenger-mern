import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  const { userInfo } = useSelector((state) => state.auth);

  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!userInfo?.id) return;

    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socketRef.current = socket;

    socket.emit("addUser", userInfo);

    socket.on("getUsers", (users) => {
      setActiveUsers(() => {
        return Object.values(users).reduce((accum, curr) => {
          if (curr.userInfo.id === userInfo.id) {
            return accum;
          }

          accum.push(curr.userInfo);
          return accum;
        }, []);
      });
    });

    return () => {
      socket.disconnect(userInfo);
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a Socket Provider");
  }

  return context;
};
