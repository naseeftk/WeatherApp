import express from 'express';
import cors from 'cors';
import weatherRoutes from './src/routes/weatherRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", weatherRoutes);

export default app;
