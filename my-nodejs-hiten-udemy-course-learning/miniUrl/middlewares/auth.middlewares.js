import { validateUserToken } from "../utils/token.js"

export function authenticationMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) return next()

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Invalid Authorization header format' })
    }

    const [_, token] = authHeader.split(" ")

    try {
        const payload = validateUserToken(token)
        if (!payload) return res.status(401).json({ error: 'Invalid or expired token' })
        req.user = payload
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

export function ensureAuthenticated(req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'You must be logged in' })
    next()
}