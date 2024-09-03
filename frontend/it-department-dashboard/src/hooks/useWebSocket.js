/**
 * Creates a WebSocket connection to the specified URL and sets up event handlers.
 * 
 * @param {string} url - The WebSocket server URL.
 * @param {function} onMessage - Callback function to handle incoming messages. The function receives parsed data as an argument.
 * @returns {Object} An object containing the WebSocket instance and a function to close the WebSocket connection.
 * @returns {WebSocket} return.socket - The WebSocket instance.
 * @returns {function} return.closeWebSocket - Function to close the WebSocket connection.
 */
export const createWebSocket = (url, onMessage) => {
  let socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = event => {
    const data = JSON.parse(event.data);

    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = error => {
    console.error("WebSocket error:", error);
  };

  const closeWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return {
    socket,
    closeWebSocket
  };
};

//   import { createWebSocket } from './utils/websocket.js';

//     const url = 'wss://example.com/socket';

//     const onMessage = (data) => {
//       console.log('Received data:', data);
//     };

//     const { socket, closeWebSocket } = createWebSocket(url, onMessage);

//     // You can now use the socket object for further interactions, e.g. sending messages
//     // socket.send(JSON.stringify({ type: 'greet', payload: 'Hello WebSocket!' }));

//     // Close the WebSocket connection when it's no longer needed
//     // closeWebSocket();
