import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import passport from 'passport';

import { configurePassport, connectDB } from '~/shared/config';
import { errorHandler } from '~/shared/middlewares';
import router from '~/shared/routes/router';

const app = express();
connectDB();

configurePassport();
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api', router);

app.use(errorHandler);

export default app;
