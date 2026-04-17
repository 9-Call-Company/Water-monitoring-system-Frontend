import { useEffect } from "react";
import { useSocketContext } from "../contexts/SocketContext";

export default function useSocket(eventName, callback) {
  const { socket } = useSocketContext() || {};

  useEffect(() => {
    if (!socket || !eventName || !callback) {
      return undefined;
    }

    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  }, [socket, eventName, callback]);

  return socket;
}
