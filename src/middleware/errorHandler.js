// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      message: err.message,
      stack: err.stack,
      errors: err.errors || undefined,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        message: err.message,
        errors: err.errors.length ? err.errors : undefined,
      });
    } else {
      console.error('ERROR: ', err);
      res.status(500).json({
        message: 'Something went wrong!',
      });
    }
  }
};

export default errorHandler;
