export const errorHandler = (statusCode = 400, message = "Not Found") => {
  const error = createError(statusCode, errorMessage);
  return error;
};
