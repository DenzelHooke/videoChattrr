const errorHandler = (err, req, res, next) => {
  // If status code was already set prior, uise that code, else set it to 500.
  const statusCode = res.statusCode ? res.statusCode : 500;

  console.log(
    `------\n[ERROR] : ${req.method} to endpoint: ${req.url}  \n${err}\n------`
      .red
  );
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = {
  errorHandler,
};
