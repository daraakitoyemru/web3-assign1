const { db, jsonMsg } = require("./db-connect");

const artistSql = `"artistId","firstName","lastName","nationality","gender","yearOfBirth","yearOfDeath","details","artistLink"`;

const getAllArtists = (app) => {
  app.get("/api/artists", async (req, res) => {
    const { data, error } = await db.from("artists").select(artistSql);
    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getArtistsById = (app) => {
  app.get("/api/artists/:id", async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .eq("artistId", req.params.id);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }

    res.send(data);
  });
};

const getArtistByLastName = (app) => {
  app.get("/api/artists/search/:substring", async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .ilike("lastName", `${req.params.substring}%`);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getArtistsByCountry = (app) => {
  app.get("/api/artists/country/:substring", async (req, res) => {
    const { data, error } = await db
      .from("artists")
      .select(artistSql)
      .ilike("nationality", `${req.params.substring}%`);

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
  getAllArtists,
  getArtistsById,
  getArtistByLastName,
  getArtistsByCountry,
};
