import mongoose from 'mongoose';
import { DATABASE_URL } from './env';

export async function connectToDatabase() {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: 'event-management',
        });

        return Promise.resolve('Database connected successfully!');

    } catch (error) {
        return Promise.reject(`Database connection fields: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}