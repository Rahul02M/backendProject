//Wrapper functions – functions that wrap other functions (commonly used in middleware, error handling, or abstraction)?

const catchAsync = (fn) => {
  const errorHandler = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return errorHandler;
};

module.exports = catchAsync;
