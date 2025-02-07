// Middleware per la verifica del token JWT
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    // Se token è undefined o null
    if (!token) {
        return res.status(401).json({ error: 'Accesso negato. Token mancante' });
    }
    // Se token è presente
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Se il token è scaduto
        return res.status(403).json({ error: 'Token non valido' });
    }
};

module.exports = authMiddleware;
