import http from 'http';
import { app } from '../../app';
import { PORT } from '../../config/config';
import { wsProxy } from '../../infraestructure/routes/proxy_routes';

const startServer = () => {
  const server = http.createServer(app);

  // 🔥 Handle WebSocket upgrade for socket.io proxy
  // ONLY for actual WebSocket connections (not polling)
  server.on('upgrade', (req, socket, head) => {
    const url = req.url || '';

    // Only handle if it's socket.io AND websocket transport
    if (url.startsWith('/socket.io') && url.includes('transport=websocket')) {
      console.log('🔌 [Gateway] WebSocket upgrade:', url);
      wsProxy.upgrade(req, socket as any, head);
    } else {
      console.log('🔌 [Gateway] Non-WS upgrade ignored:', url);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} `);
  });
};

export { startServer };