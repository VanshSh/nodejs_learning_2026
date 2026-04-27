import jwt from "jsonwebtoken"

export function createUserToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

    return token;

}