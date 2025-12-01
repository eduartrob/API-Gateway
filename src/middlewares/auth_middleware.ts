import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 🔍 LOG: Ver qué ruta está llegando
    console.log('🔐 [Auth Middleware] Verificando ruta:');
    console.log('   - req.path:', req.path);
    console.log('   - req.originalUrl:', req.originalUrl);
    console.log('   - req.url:', req.url);
    console.log('   - req.method:', req.method);

    const publicPaths = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/recover-password',
        '/api/auth/reset-password',
        '/api/health',
        '/health'
    ];

    // Verificar tanto path como originalUrl para mayor compatibilidad
    const isPublicPath = publicPaths.some(publicPath =>
        req.path.startsWith(publicPath) || req.originalUrl.startsWith(publicPath)
    );

    console.log('   - ¿Es ruta pública?:', isPublicPath);

    if (isPublicPath) {
        console.log('   ✅ Ruta pública - Permitiendo acceso sin token');
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('   ❌ No se encontró token - Acceso denegado');
        return res.status(401).json({ message: 'Acceso denegado: No se proporcionó token.' });
    }
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Error interno: El secreto de autenticación no está configurado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Token no válido o expirado.' });
    }
};