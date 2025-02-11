import { createContext, useEffect, useState, useContext } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const WS_BASE_URL = process.env.REACT_APP_BASE_URL.startsWith("https")
    ? process.env.REACT_APP_BASE_URL.replace("https", "wss")
    : process.env.REACT_APP_BASE_URL.replace("http", "ws");

  const connectWebSocket = (userId) => {
    if (!userId) return; // userId가 없으면 연결하지 않음

    // 기존 소켓이 있으면 닫기 (중복 연결 방지)
    if (socket) {
      socket.close();
    }

    const ws = new WebSocket(`${WS_BASE_URL}/api/ws/${userId}`);

    ws.onopen = () => {
      console.log("WebSocket 연결");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket 메시지 수신: ", event.data);
      alert(event.data); // 알림 창 띄우기
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error);
    };

    setSocket(ws);
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      console.log("WebSocket 연결 해제");
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      connectWebSocket(userId);
    }

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ socket, connectWebSocket, disconnectWebSocket }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
