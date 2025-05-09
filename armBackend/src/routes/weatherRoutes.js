import express from 'express';
import { getCurrentCity, getForcast } from '../controller/weather.js';

const weatherRouter = express.Router();

weatherRouter
  .post('/weather', getCurrentCity)
  .post('/forcast', getForcast);

export default weatherRouter;
