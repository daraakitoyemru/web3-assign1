const { db, jsonMsg } = require("./db-connect");

const eraSql = '"eraId", "eraName", "eraYears"';

const getAllEras = (app) => {
  app.get("/api/eras", async (req, res) => {
    const { data, error } = await db.from("eras").select(eraSql);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

module.exports = { getAllEras };
