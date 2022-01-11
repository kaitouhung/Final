const express = require('express');
const cors = require('cors');

const { connectMongo } = require('./config/mongodb');
const { rootRouter } = require('./routes');
const AppError = require('./utils/appError');
const { checkAuthenEvent } = require('./kafka/auth.consumer');
const { authenticateEvent } = require('./kafka/auth.producer');

connectMongo();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1', rootRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Not Found Router', 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  return res.status(statusCode).json({
    status: status,
    message: err.message,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App is running in ${PORT}`);
  // checkAuthenEvent();
});
