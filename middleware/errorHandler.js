import constants from "../src/config/constants.js";

const errorHandler = (err, req, res, next) => {
  // Setting default status code
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  const response = {
    title: getTitleFromStatusCode(statusCode),
    message: err.message,
  };

  // Stack trace included only in development environment
  if (process.env.NODE_ENV !== "production") {
    response.stackTrace = err.stack;
  }

  res.json(response);
};

// Helper function to map status codes to titles
const getTitleFromStatusCode = (statusCode) => {
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return "Validation Error";
    case constants.UNAUTHORIZED:
      return "Unauthorized";
    case constants.FORBIDDEN:
      return "Forbidden";
    case constants.NOT_FOUND:
      return "Not Found";
    case constants.SERVER_ERROR:
      return "Internal Server Error";
    default:
      return "Error";
  }
};

export default errorHandler;
