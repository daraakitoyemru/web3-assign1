const { db } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const artistSql = `"artistId","firstName","lastName","nationality","gender","yearOfBirth","yearOfDeath","details","artistLink"`;

const getAllArtists = (app) => {
  app.get("/api/artists", handleAsync(async (req, res) => {
    const { data, error } = await db.from("artists").select(artistSql);
    
    if (handleDbResponse(data, error, res, "No artists found")) return;
    
    res.status(200).json(data);
  }, "getAllArtists"));
};

const getArtistsById = (app) => {
  app.get("/api/artists/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .eq("artistId", req.params.id);

    if (handleDbResponse(data, error, res, `Artist with id ${req.params.id} not found`)) return;

    res.status(200).json(data);
  }, "getArtistsById"));
};

const getArtistByLastName = (app) => {
  app.get("/api/artists/search/:substring", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .ilike("lastName", `${req.params.substring}%`);

    if (handleDbResponse(data, error, res, `No artists found with last name matching '${req.params.substring}'`)) return;

    res.status(200).json(data);
  }, "getArtistByLastName"));
};

const getArtistsByCountry = (app) => {
  app.get("/api/artists/country/:substring", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .ilike("nationality", `${req.params.substring}%`);

    if (handleDbResponse(data, error, res, `No artists found from country matching '${req.params.substring}'`)) return;

    res.status(200).json(data);
  }, "getArtistsByCountry"));
};

module.exports = {
  getAllArtists,
  getArtistsById,
  getArtistByLastName,
  getArtistsByCountry,
};
