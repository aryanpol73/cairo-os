import { useEffect, useRef } from 'react';

export const useWebSocket = (onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);
  
  // Use the environment variable we set in Vercel
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'wss://cairo-os-api.onrender.com';
  const socketUrl = `${apiBase}/ws/orchestrate`;

  useEffect(() => {
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => console.log("[FRONTEND] Connected to Cairo OS Backend");
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [socketUrl]);

  return socketRef.current;
};