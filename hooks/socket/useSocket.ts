"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const client = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      transports: ["websocket"],
      autoConnect: true,
    });

    setSocket(client);

    return () => {
      client.disconnect();
    };
  }, []);

  return socket;
}
