const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    // Se il token è mancante
    if (!token)
        return res.status(401).json({ error: 'Accesso negato. Token mancante' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        console.log(`[${new Date().toLocaleString()}] Token verificato:`, decoded);  // Log di test per scadenza token
        console.log(`[${new Date().toLocaleString()}] Data di scadenza:`, new Date(decoded.exp * 1000));

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Errore verifica token:', error.message);

        if (error.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'Token scaduto. Effettua nuovamente il login.' });
        else
            return res.status(403).json({ error: 'Token non valido' });
    }
}

module.exports = authMiddleware;
