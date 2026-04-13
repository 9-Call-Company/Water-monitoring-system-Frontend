import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const instance = io(
      import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000",
      {
        autoConnect: true,
        transports: ["websocket"],
      },
    );

    instance.on("connect", () => setIsConnected(true));
    instance.on("disconnect", () => setIsConnected(false));
    setSocket(instance);

    return () => {
      instance.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
