"use client";

import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const socket = useMemo(() => {
    if (typeof window === "undefined") return null;

    return io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return socket;
}
