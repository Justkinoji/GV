    import mongoose, { Mongoose } from 'mongoose';

    const connection: { isConnected?: number } = {};

    const connectDB = async (): Promise<void> => {
        if (connection.isConnected) {
            console.log('Already connected');
            return;
        }

        try {
            const db: Mongoose = await mongoose.connect(process.env.MONGO_URI!);
            if (db.connections && db.connections[0]) {
                connection.isConnected = db.connections[0].readyState;
            }
            console.log(
                'MongoDB connection status:',
                connection.isConnected === 1 ? 'connected' : 'disconnected'
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error connecting to MongoDB:', error.message);
            } else {
                console.error('Error connecting to MongoDB:', error);
            }
        }
    };

    export default connectDB;