import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dbConnect from './src/dbConfig/connectDb.js';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3000;


dbConnect()

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
