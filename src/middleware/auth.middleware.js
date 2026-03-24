import authService from '../services/auth.service.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header is missing',
      });
    }

    // Esperar formato "Bearer TOKEN"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid authorization header format. Use "Bearer TOKEN"',
      });
    }

    const token = parts[1];

    // Verificar y decodificar el token
    const decoded = authService.verifyToken(token);

    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.message.includes('jwt expired')) {
      return res.status(401).json({
        error: 'Token expired',
      });
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }
};

export default authMiddleware;
