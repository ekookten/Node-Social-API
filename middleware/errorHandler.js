const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: err.errors });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate field value', field: err.keyValue });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  };
  