const { db, jsonMsg } = require("./db-connect");

const paintingsSql = `
paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, copyrightText, 
description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, 
googleDescription, wikiLink, jsonAnnotations, 
artists (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), 
galleries (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, 
          galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId)
`;

const getAllPaintings = (app) => {
  app.get("/api/paintings", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingsByTitleOrYear = (app) => {
  app.get("/api/paintings/sort/:var", async (req, res) => {
    const sortBy =
      req.params.var === "year"
        ? "yearOfWork"
        : req.params.var === "title"
        ? "title"
        : null;

    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .order(sortBy, { ascending: true, nullsFirst: false });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }

    res.send(data);
  });
};

const getPaintingById = (app) => {
  app.get("/api/paintings/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("paintingId", req.params.id)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingsBySearch = (app) => {
  app.get("/api/paintings/search/:substring", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .ilike("title", `%${req.params.substring}%`)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

// do error handle errors
const getPaintingsInRange = (app) => {
  app.get("/api/paintings/years/:start/:end", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .gte("yearOfWork", req.params.start)
      .lte("yearOfWork", req.params.end)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingsByGalleryId = (app) => {
  app.get("/api/paintings/galleries/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("galleryId", req.params.id)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingsByArtistId = (app) => {
  app.get("/api/paintings/artist/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("artistId", req.params.id)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingsByArtistCountry = (app) => {
  app.get("/api/paintings/artist/country/:substring", async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .ilike("artists.nationality", `${req.params.substring}%`)
      .order("title", { ascending: true });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    let filteredData = data.filter((d) => d.artists !== null);
    res.send(filteredData);
  });
};

const getPaintingInfoFromGenreId = (app) => {
  app.get("/api/paintings/genre/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(`paintings:paintings (paintingId, title, yearOfWork)`)
      .eq("genreId", req.params.id)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getPaintingInfoFromEraId = (app) => {
  app.get("/api/paintings/era/:id", async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(
        `paintings:paintings (paintingId, title, yearOfWork), era:genreId!inner (eraId)`
      )
      .eq("genreId.eraId", req.params.id)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });

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
  getAllPaintings,
  getPaintingById,
  getPaintingsByArtistCountry,
  getPaintingsByGalleryId,
  getPaintingsByArtistId,
  getPaintingsInRange,
  getPaintingsBySearch,
  getPaintingsByTitleOrYear,
  getPaintingInfoFromGenreId,
  getPaintingInfoFromEraId,
};
