"use client";

import { useEffect } from "react";
import { useSocket } from "@/hooks/socket/useSocket";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return <>{children}</>;
}