const { db, encodeSpecialChars } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const genreSql = `genreId, genreName, eraId, description, wikiLink, eras (eraId, eraName, eraYears)`;
const paintingsSql = `
paintingId, imageFileName, title, shapeId, museumLink, accessionNumber, copyrightText, 
description, excerpt, yearOfWork, width, height, medium, cost, MSRP, googleLink, 
googleDescription, wikiLink, jsonAnnotations, 
artists (artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink), 
galleries (galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, 
          galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId)
`;
const getAllGenres = (app) => {
  app.get(
    "/api/genres",
    handleAsync(async (req, res) => {
      // First get all genres
      const { data: genresData, error: genresError } = await db
        .from("genres")
        .select(genreSql);

      if (handleDbResponse(genresData, genresError, res, "No genres found"))
        return;

      // For each genre, get related paintings
      const genresWithPaintings = await Promise.all(
        genresData.map(async (genre) => {
          const { data: paintingsData, error: paintingsError } = await db
            .from("paintingGenres")
            .select(`paintings:paintings (${paintingsSql})`)
            .eq("genreId", genre.genreId)
            .order("paintings(yearOfWork)", { ascending: true });

          if (paintingsError) {
            console.error(
              `Error fetching paintings for genre ${genre.genreId}:`,
              paintingsError
            );
            return {
              ...genre,
              paintings: [],
            };
          }

          return {
            ...genre,
            paintings: paintingsData.map((item) => item.paintings),
          };
        })
      );

      // Ensure proper encoding for special characters
      res.setHeader("Content-Type", "application/json; charset=utf-8");

      // Process the data to handle special characters
      const encodedData = encodeSpecialChars(genresWithPaintings);

      res.status(200).json(encodedData);
    }, "getAllGenres")
  );
};

const getGenresByPaintingId = (app) => {
  app.get(
    "/api/genres/painting/:id",
    handleAsync(async (req, res) => {
      const { data, error } = await db
        .from("paintingGenres")
        .select(`genres (${genreSql})`)
        .eq("paintingId", req.params.id)
        .order("genreName", { foreignTable: "genres", ascending: true });

      if (
        handleDbResponse(
          data,
          error,
          res,
          `No genres found for painting with id ${req.params.id}`
        )
      )
        return;

      res.status(200).json(data);
    }, "getGenresByPaintingId")
  );
};

const getGenresById = (app) => {
  app.get(
    "/api/genres/:id",
    handleAsync(async (req, res) => {
      const { data, error } = await db
        .from("genres")
        .select(genreSql)
        .eq("genreId", req.params.id);

      if (
        handleDbResponse(
          data,
          error,
          res,
          `Genre with id ${req.params.id} not found`
        )
      )
        return;

      res.status(200).json(data);
    }, "getGenresById")
  );
};

const getGenreWithPaintings = (app) => {
  app.get(
    "/api/genres/:id/paintings",
    handleAsync(async (req, res) => {
      // First, get the genre information
      const { data: genreData, error: genreError } = await db
        .from("genres")
        .select(genreSql)
        .eq("genreId", req.params.id);

      if (
        handleDbResponse(
          genreData,
          genreError,
          res,
          `Genre with id ${req.params.id} not found`
        )
      )
        return;

      // Then, get all paintings associated with this genre
      const { data: paintingsData, error: paintingsError } = await db
        .from("paintingGenres")
        .select(`paintings:paintings (${paintingsSql})`)
        .eq("genreId", req.params.id)
        .order("paintings(yearOfWork)", { ascending: true });

      if (paintingsError) {
        return res.status(500).json({ error: paintingsError.message });
      }

      // Combine the data
      const result = {
        genre: genreData[0],
        paintings: paintingsData.map((item) => item.paintings),
      };

      // Ensure proper encoding for special characters
      res.setHeader("Content-Type", "application/json; charset=utf-8");

      // Process the data to handle special characters
      const encodedData = encodeSpecialChars(result);

      res.status(200).json(encodedData);
    }, "getGenreWithPaintings")
  );
};

module.exports = {
  getAllGenres,
  getGenresById,
  getGenresByPaintingId,
  getGenreWithPaintings,
};
