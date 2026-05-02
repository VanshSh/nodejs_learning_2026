import express from 'express';
import userRoutes from "./routes/user.routes.js"
import urlRoutes from "./routes/url.routes.js"
import { authenticationMiddleware } from "./middlewares/auth.middlewares.js"
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get("/health_check", (req, res) => {
    res.status(200).json({ message: "Server is healthy!" })
})


// Public routes — no auth
app.use('/user', userRoutes)

// Protected routes — auth required
app.use(authenticationMiddleware);
app.use(urlRoutes)


app.listen(PORT, () => {
    console.log('🖥 Server is running on port 3000');
})