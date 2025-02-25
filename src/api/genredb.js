const { db, jsonMsg } = require("./db-connect");
const genreSql = `genreId, genreName, eraId, description, wikiLink, eras (eraId, eraName, eraYears)`;

const getAllGenres = (app) => {
  app.get("/api/genres", async (req, res) => {
    const { data, error } = await db.from("genres").select(genreSql);
    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getGenresByPaintingId = (app) => {
  app.get("/api/genres/painting/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(`genres (${genreSql})`)
      .eq("paintingId", req.params.id)
      .order("genreName", { foreignTable: "genres", ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    console.log();
    res.send(data);
  });
};

const getGenresById = (app) => {
  app.get("/api/genres/:id", async (req, res) => {
    const { data, error } = await db
      .from("genres")
      .select(genreSql)
      .eq("genreId", req.params.id);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

module.exports = {
  getAllGenres,
  getGenresById,
  getGenresByPaintingId,
};
