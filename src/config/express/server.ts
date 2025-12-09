import http from 'http';
import { app } from '../../app';
import { PORT } from '../../config/config';
import { wsProxy } from '../../infraestructure/routes/proxy_routes';

const startServer = () => {
  const server = http.createServer(app);

  // 🔥 Handle WebSocket upgrade for socket.io proxy
  // ONLY for actual WebSocket connections (transport=websocket)
  server.on('upgrade', (req, socket, head) => {
    const url = req.url || '';

    // Only handle actual websocket transport
    if (url.startsWith('/socket.io') && url.includes('transport=websocket')) {
      console.log('🔌 [Gateway] WebSocket upgrade:', url);
      wsProxy.upgrade(req, socket as any, head);
    }
    // Non-websocket requests reaching upgrade handler is unexpected
    // Don't destroy - log and leave alone (may be handled by other listeners)
  });

  server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} `);
  });
};

export { startServer };