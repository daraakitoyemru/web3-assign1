const { db } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const eraSql = '"eraId", "eraName", "eraYears"';

const getAllEras = (app) => {
  app.get("/api/eras", handleAsync(async (req, res) => {
    const { data, error } = await db.from("eras").select(eraSql);
    
    if (handleDbResponse(data, error, res, "No eras found")) return;
    
    res.status(200).json(data);
  }, "getAllEras"));
};

module.exports = { getAllEras };
