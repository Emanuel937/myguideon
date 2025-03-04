// const { verifyToken } = require('../helpers/jwtHelper');

// /**
//  * Middleware to check authentication
//  */

// function authMiddleware(req, res, next) {
//     const token = req.headers.authorization?.split(' ')[1];
//     console.log("Token reçu :", token);
//     if (!token) return res.status(401).json({ error: 'Access denied' });
    
//     const decoded = verifyToken(token);
//     console.log("token Décodé :", decoded);
//     if (!decoded) return res.status(401).json({ error: 'Invalid token' });
    
//     req.user = decoded;
//     next();
// }

// module.exports = authMiddleware;


const { verifyToken } = require('../helpers/jwtHelper');
const tables = require('../../database/table');

/**
 * Middleware to check authentication and permissions
 */
function authMiddleware(requiredPermission) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Access denied' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            if (!decoded) {

                return res.status(401).json({ error: 'Invalid token' });
            }

            req.user = decoded;

            // 🔒 Vérifier les permissions si nécessaire
            if (requiredPermission) {
                const permissions = await tables.role_permissions.getPermissionsByRoleId(decoded.role_id);
                const hasPermission = permissions.some(p => p.name === requiredPermission);
                if (!hasPermission) {
                    return res.status(403).json({ error: 'Forbidden' });
                }
            }

            next();
        } catch (error) {
            console.error("❌ Erreur dans authMiddleware:", error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    };
}


// async function authMiddleware(requiredPermission) {
//     return async (req, res, next) => {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) return res.status(401).json({ error: 'Access denied' });

//         const token = authHeader.split(' ')[1];
//         const decoded = verifyToken(token);
//         if (!decoded) return res.status(401).json({ error: 'Invalid token' });

//         req.user = decoded;

//         // 🔒 Check permissions if required
//         if (requiredPermission) {
//             const [permissions] = await tables.role_permissions.getPermissionsByRoleId(decoded.role_id);
//             const hasPermission = permissions.some(p => p.name === requiredPermission);
//             if (!hasPermission) return res.status(403).json({ error: 'Forbidden' });
//         }

//         next();
//     };
// }

module.exports = authMiddleware;