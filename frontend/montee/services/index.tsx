import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Create a Context for WebSocket
const WebSocketContext = createContext({
  ws: null as WebSocket | null,
  videoData: null as ArrayBuffer | null,
});

// WebSocket Provider to manage WebSocket connection
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<WebSocket | null>(null); // Using WebSocket or null type
  const [videoData, setVideoData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.0.18:3000');
    socket.binaryType = 'arraybuffer';
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(socket);  
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data.byteLength);
      setVideoData(event.data);
    };

    socket.onerror = (error) => {
      console.log('WebSocket Error: ', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setWs(null); // Reset WebSocket state on close
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ws, videoData}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext; // Exporting the context to be used in other components
