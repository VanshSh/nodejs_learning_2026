import { nanoid } from "nanoid";
import db from "../db/index.js"; 
import { urlsTable } from "../models/url.model.js"; 

export async function insertUrl({ url, code, userId }) {
    const shortCode = code ?? nanoid(6);
    const [result] = await db.insert(urlsTable).values({
        targetUrl: url,
        shortCode,
        userId: userId
    }).returning({ id: urlsTable.id, shortCode: urlsTable.shortCode, targetUrl: urlsTable.targetUrl })

    return result
}