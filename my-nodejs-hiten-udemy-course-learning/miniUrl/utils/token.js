import jwt from "jsonwebtoken"

export function createUserToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

    return token;

}

export function validateUserToken(token) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        return payload
    } catch (err) {
        return null
    }

}