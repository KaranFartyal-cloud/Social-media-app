import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useBackendUrl } from "./backendContext";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);
  const backendUrl = useBackendUrl();

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(backendUrl, {
      query: { userId },
      transports: ["websocket"],
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
