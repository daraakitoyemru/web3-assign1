const { db, encodeSpecialChars } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const paintingsSql = `
paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, copyrightText, 
description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, 
googleDescription, wikiLink, jsonAnnotations, 
artists (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), 
galleries (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, 
          galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId)
`;

const getAllPaintings = (app) => {
  app.get("/api/paintings", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, "No paintings found")) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getAllPaintings"));
};

const getPaintingsByTitleOrYear = (app) => {
  app.get("/api/paintings/sort/:var", handleAsync(async (req, res) => {
    const sortBy =
      req.params.var === "year"
        ? "yearOfWork"
        : req.params.var === "title"
        ? "title"
        : null;

    if (!sortBy) {
      return res.status(400).json({ error: "Invalid sort parameter. Use 'year' or 'title'." });
    }

    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .order(sortBy, { ascending: true, nullsFirst: false });

    if (handleDbResponse(data, error, res, `No paintings found to sort by ${req.params.var}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingsByTitleOrYear"));
};

const getPaintingById = (app) => {
  app.get("/api/paintings/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("paintingId", req.params.id)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `Painting with id ${req.params.id} not found`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingById"));
};

const getPaintingsBySearch = (app) => {
  app.get("/api/paintings/search/:substring", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .ilike("title", `%${req.params.substring}%`)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `No paintings found matching '${req.params.substring}'`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingsBySearch"));
};

const getPaintingsInRange = (app) => {
  app.get("/api/paintings/years/:start/:end", handleAsync(async (req, res) => {
    const { start, end } = req.params;
    
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Start and end years must be numbers" });
    }

    if (parseInt(start) > parseInt(end)) {
      return res.status(400).json({ error: "Start year must be less than or equal to end year" });
    }

    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .gte("yearOfWork", start)
      .lte("yearOfWork", end)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `No paintings found between years ${start} and ${end}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingsInRange"));
};

const getPaintingsByGalleryId = (app) => {
  app.get("/api/paintings/galleries/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("galleryId", req.params.id)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `No paintings found for gallery with id ${req.params.id}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingsByGalleryId"));
};

const getPaintingsByArtistId = (app) => {
  app.get("/api/paintings/artist/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .eq("artistId", req.params.id)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `No paintings found for artist with id ${req.params.id}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingsByArtistId"));
};

const getPaintingsByArtistCountry = (app) => {
  app.get("/api/paintings/artist/country/:substring", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintings")
      .select(paintingsSql)
      .ilike("artists.nationality", `${req.params.substring}%`)
      .order("title", { ascending: true });

    if (handleDbResponse(data, error, res, `No paintings found by artists from country matching '${req.params.substring}'`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    const filteredData = data.filter((d) => d.artists !== null);
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(filteredData);
    
    res.status(200).json(encodedData);
  }, "getPaintingsByArtistCountry"));
};

const getPaintingInfoFromGenreId = (app) => {
  app.get("/api/paintings/genre/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(`paintings:paintings (paintingId, title, yearOfWork)`)
      .eq("genreId", req.params.id)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });

    if (handleDbResponse(data, error, res, `No paintings found for genre with id ${req.params.id}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingInfoFromGenreId"));
};

const getPaintingInfoFromEraId = (app) => {
  app.get("/api/paintings/era/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("paintingGenres")
      .select(
        `paintings:paintings (paintingId, title, yearOfWork), era:genreId!inner (eraId)`
      )
      .eq("genreId.eraId", req.params.id)
      .order("paintings(yearOfWork)", {
        ascending: true,
      });

    if (handleDbResponse(data, error, res, `No paintings found for era with id ${req.params.id}`)) return;

    // Ensure proper encoding for special characters
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Process the data to handle special characters
    const encodedData = encodeSpecialChars(data);
    
    res.status(200).json(encodedData);
  }, "getPaintingInfoFromEraId"));
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
