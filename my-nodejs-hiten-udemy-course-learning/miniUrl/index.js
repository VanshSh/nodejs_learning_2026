import express from 'express';
import userRoutes from "./routes/user.routes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health_check",(req,res)=>{
res.status(200).json({message:"Server is healthy!"})
})


// Routes //

// => User Routes <= // 
app.use('/user',userRoutes)

app.listen(PORT,()=>{
    console.log('🖥 Server is running on port 3000');
})