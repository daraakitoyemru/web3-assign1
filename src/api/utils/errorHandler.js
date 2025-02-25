const { jsonMsg } = require("../db-connect");

const handleAsync = (handler, routeName) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`Error in ${routeName}:`, err);
      res.status(500).json(jsonMsg("Internal server error", err.message));
    }
  };
};

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
    return true;
  }

  return false;
};

module.exports = {
  handleAsync,
  handleDbResponse,
};
