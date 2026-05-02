import express from 'express';
import { shortenPostRequestBodySchema } from "../validations/request.validation.js"
import { ensureAuthenticated } from '../middlewares/auth.middlewares.js';
import { insertUrl } from '../services/url.service.js';
import { urlsTable } from '../models/url.model.js';
import db from '../db/index.js';
import { and, eq } from 'drizzle-orm';

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async (req, res) => {
    try {
        const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.format() })
        }

        const { url, code } = validationResult.data;
        const userId = req.user.userId;

        const result = await insertUrl({ url, code, userId })
        return res.status(201).json({ data: result })
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})
router.get("/codes", ensureAuthenticated, async (req, res) => {
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.userId))
    return res.status(200).json({ data: codes })
})

router.delete("/:id", ensureAuthenticated, async (req, res) => {
    const id = req.params.id;
    await db.delete(urlsTable).where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.userId)))
    return res.status(200).json({ message: 'URL deleted successfully' })
})

router.get("/:shortCode", async (req, res) => {
    const code = req.params.shortCode;
    const [result] = await db
        .select({
            targetURL: urlsTable.targetUrl,
        })
        .from(urlsTable)
        .where(eq(urlsTable.shortCode, code));

    if (!result) {
        return res.status(404).json({ error: 'Invalid URL' });
    }

    return res.redirect(result.targetURL);
})



export default router;