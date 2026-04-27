import express from 'express';
import { loginPostRequestBodySchema, signupPostRequestBodySchema } from "../validations/request.validation.js"
import { hashPasswordWithSalt } from '../utils/hash.js';
import { createUser, getUserByEmail } from '../services/user.service.js';
import { createUserToken } from '../utils/token.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    // Validate Request Body
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() })
    }

    // Destructure Validated Data
    const { firstname, lastname, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ error: `User with email ${email} already exists` })
    }

    // Hash Password
    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    // Create User
    const user = await createUser({ firstname, lastname, email, password: hashedPassword, salt })


    // Final Response
    return res.status(201).json({ data: { userId: user.id } })
})



router.post('/login', async (req, res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() })
    }

    const { email, password } = validationResult.data;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({ error: `User with email ${email} does not exist` })
    }

    const { password: hashedPassword } = hashPasswordWithSalt(password, user.salt);
    if (hashedPassword !== user.password) {
        return res.status(401).json({ error: `Invalid credentials` })
    }

    const token = createUserToken({ userId: user.id })

    return res.status(200).json({ data: { token } })

})





export default router;