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

    // Add error handler to prevent ECONNRESET crashes
    socket.on('error', (err) => {
      console.log('🔌 [Gateway] Socket error (handled):', err.message);
    });

    // Set socket timeout for upgrade to prevent hanging connections
    (socket as any).setTimeout(30000);
    socket.on('timeout', () => {
      console.log('🔌 [Gateway] Socket upgrade timeout');
      socket.destroy();
    });

    // Only handle actual websocket transport
    if (url.startsWith('/socket.io') && url.includes('transport=websocket')) {
      console.log('🔌 [Gateway] WebSocket upgrade:', url);
      wsProxy.upgrade(req, socket as any, head);
    }
    // For non-websocket, socket will timeout naturally (no explicit handling needed)
  });

  // Handle uncaught errors to prevent crashes
  process.on('uncaughtException', (err) => {
    console.error('🔴 [Gateway] Uncaught exception:', err.message);
    // Don't exit - keep running
  });

  server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} `);
  });
};

export { startServer };