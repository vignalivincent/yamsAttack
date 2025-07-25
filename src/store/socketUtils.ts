interface WebSocketConnectionOptions {
  url: string;
  onOpen?: () => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export function createWebSocketConnection(options: WebSocketConnectionOptions): WebSocket {
  const { url, onOpen, onMessage, onClose, onError } = options;
  const socket = new WebSocket(url);
  if (onOpen) socket.onopen = onOpen;
  if (onMessage) socket.onmessage = onMessage;
  if (onClose) socket.onclose = onClose;
  if (onError) socket.onerror = onError;
  return socket;
}
