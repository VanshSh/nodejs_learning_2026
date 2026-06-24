import mongoose from 'mongoose';

export const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('🆚 CONNECTED',);
    } catch (err) {
        console.error("MongoDB connection err", err)
        process.exit(1)
    }
}

