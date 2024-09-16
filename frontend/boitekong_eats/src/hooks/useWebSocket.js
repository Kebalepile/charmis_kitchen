import { useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, onMessage]);

  return socketRef.current;
};

export default useWebSocket;
