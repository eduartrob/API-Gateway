import { Router, Request, Response } from 'express';
import proxyRoutes, { wsProxy } from './proxy_routes';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { MICROSERVICES } from '../../config/config';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Gateway is UP');
});

// ✅ Proxy para archivos estáticos (uploads) - ANTES de /api para que sea /uploads directamente
// NOTA: router.use('/uploads') quita el prefijo /uploads, así que debemos re-agregarlo
router.use('/uploads', createProxyMiddleware({
    target: MICROSERVICES.social,
    changeOrigin: true,
    pathRewrite: (path) => '/uploads' + path,  // Ej: /publications/img.jpg -> /uploads/publications/img.jpg
    on: {
        proxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(`🔄 [Gateway] Proxy upload: ${req.method} /uploads${req.url}`);
        },
    },
}));

// 🔥 Socket.io proxy at ROOT level (not under /api) - handles HTTP polling
router.use('/socket.io', wsProxy);

router.use('/api', authMiddleware);
router.use('/api', proxyRoutes);


export default router;