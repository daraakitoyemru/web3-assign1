const { jsonMsg } = require("../db-connect");

// general handler for express instance
const handleAsync = (handler, route) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`Error in ${route}:`, err);
      res.status(500).json(jsonMsg("Internal server error", err.message));
    }
  };
};

// general response message manager
const handleDbResponse = (
  data,
  error,
  res,
  notFoundMessage = "Record not found"
) => {
  if (error) {
    res.status(500).json(jsonMsg("Error: unable to satisfy request", error));
    return true;
  }

  if (!data || data.length === 0) {
    res.status(404).json(jsonMsg(notFoundMessage));
    return true; // prevent server crash
  }

  return false;
};

module.exports = {
  handleAsync,
  handleDbResponse,
};
