import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { googleAuth } from './services/passport.js';

import connectDB from './db/connect.js';

import authRouter from './routes/authRoutes.js';

import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  cors({
    origin: process.env.FRONT_END_ORIGIN,
    optionsSuccessStatus: 200,
  })
);
googleAuth(passport);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(xss());
app.use(
  mongoSanitize({
    allowDots: true,
  })
);
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (err) {
    console.log(`Server could not start with error: ${err.message}`);
  }
};

start();
