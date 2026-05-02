import express from 'express';
import { shortenPostRequestBodySchema } from "../validations/request.validation.js"
import { ensureAuthenticated } from '../middlewares/auth.middlewares.js';
import { insertUrl } from '../services/url.service.js';

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async (req, res) => {
    try {
        console.log(req.body)
        const validationResult = await shortenPostRequestBodySchema.safeParse(req.body);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.format() })
        }

        const { url, code } = validationResult.data;
        const userId = req.user.userId; 

        const result = await insertUrl({ url, code, userId }) 
        return res.status(201).json({ data: result })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;