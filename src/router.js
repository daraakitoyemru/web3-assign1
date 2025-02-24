const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const db = createClient(supabaseUrl, supabaseKey);

const eraSql = '"eraId", "eraName", "eraYears"';
const artistSql =
  '"artistId","firstName","lastName","nationality","gender","yearOfBirth","yearOfDeath","details","artistLink"';
const galleriesSql =
  ' "galleryId","galleryName","galleryNativeName","galleryCity","galleryAddress","galleryCountry","latitude","longitude","galleryWebSite","flickrPlaceId","yahooWoeId","googlePlaceId"';
const paintingsSql = `
paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, copyrightText, 
description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, 
googleDescription, wikiLink, jsonAnnotations, 
artists (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), 
galleries (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, 
          galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId)
`;
const genreSql = `genreId, genreName, eraId, description, wikiLink, eras (eraId, eraName, eraYears)`;
const jsonMsg = (message) => {
  return { message: message };
};

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

const getAllGalleries = (app) => {
  app.get("/api/galleries", async (req, res) => {
    const { data, error } = await db.from("galleries").select(galleriesSql);
    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getGalleriesById = (app) => {
  app.get("/api/galleries/:id", async (req, res) => {
    const { data, error } = await db
      .from("galleries")
      .select(galleriesSql)
      .eq("galleryId", req.params.id);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

const getGalleriesBySubstring = (app) => {
  app.get("/api/galleries/country/:substring", async (req, res) => {
    const { data, error } = await db
      .from("galleries")
      .select(galleriesSql)
      .ilike("galleryCountry", `${req.params.substring}%`);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
    res.send(data);
  });
};

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
      .from("genres")
      .select(genreSql)
      .eq("paintingGenres.paintingId", req.params.id)
      .order("genreName", { ascending: true });
    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else if (data.length == 0) {
      res.send(jsonMsg("Record not found"));
      return;
    }
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

module.exports = {
  getAllEras,
  getAllGalleries,
  getGalleriesById,
  getGalleriesBySubstring,
  getAllArtists,
  getArtistsById,
  getArtistByLastName,
  getArtistsByCountry,
  getAllPaintings,
  getPaintingsByTitleOrYear,
  getPaintingById,
  getPaintingsBySearch,
  getPaintingsInRange,
  getPaintingsByGalleryId,
  getPaintingsByArtistId,
  getPaintingsByArtistCountry,
  getAllGenres,
  getGenresById,
  getGenresByPaintingId,
  getPaintingInfoFromGenreId,
};
