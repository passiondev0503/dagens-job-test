function sendResponse(res, status, data, message = null) {
  res.status(status).json({
    status: status,
    message: message,
    data: data,
  });
}

module.exports = { sendResponse };
