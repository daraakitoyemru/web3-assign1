const { db } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const genreSql = `genreId, genreName, eraId, description, wikiLink, eras (eraId, eraName, eraYears)`;

const getAllGenres = (app) => {
  app.get("/api/genres", handleAsync(async (req, res) => {
    const { data, error } = await db.from("genres").select(genreSql);
    
    if (handleDbResponse(data, error, res, "No genres found")) return;
    
    res.status(200).json(data);
  }, "getAllGenres"));
};

const getGenresByPaintingId = (app) => {
  app.get("/api/genres/painting/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(`genres (${genreSql})`)
      .eq("paintingId", req.params.id)
      .order("genreName", { foreignTable: "genres", ascending: true });

    if (handleDbResponse(data, error, res, `No genres found for painting with id ${req.params.id}`)) return;

    res.status(200).json(data);
  }, "getGenresByPaintingId"));
};

const getGenresById = (app) => {
  app.get("/api/genres/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("genres")
      .select(genreSql)
      .eq("genreId", req.params.id);

    if (handleDbResponse(data, error, res, `Genre with id ${req.params.id} not found`)) return;

    res.status(200).json(data);
  }, "getGenresById"));
};

module.exports = {
  getAllGenres,
  getGenresById,
  getGenresByPaintingId,
};
