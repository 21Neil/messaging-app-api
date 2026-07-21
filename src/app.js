import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRouter from './routes/api.router.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser())

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () =>
  console.log(`server running in http://localhost:${PORT} ...`),
);
