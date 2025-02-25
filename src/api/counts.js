const { db } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const getCountForPaintingsPerGenre = (app) => {
  app.get(
    "/api/counts/genres",
    handleAsync(async (req, res) => {
      const { data, error } = await db.from("paintingGenres").select(`
      genres!inner(genreName),
      paintings!inner(paintingId)
    `);

      if (handleDbResponse(data, error, res)) return;

      const genreCounts = data.reduce((acc, item) => {
        const genreName = item.genres["genreName"];
        acc[genreName] = (acc[genreName] || 0) + 1;
        return acc;
      }, {});
      let mappedGenreCount = Object.entries(genreCounts).map(
        ([genreName, numOfPaintings]) => ({ genreName, numOfPaintings })
      );
      let sorted = mappedGenreCount.sort(
        (a, b) => a.numOfPaintings - b.numOfPaintings
      );

      res.status(200).json(sorted);
    }, "getCountForPaintingsPerGenre")
  );
};

const getCountForPaintingsPerArtist = (app) => {
  app.get(
    "/api/counts/artists",
    handleAsync(async (req, res) => {
      const { data, error } = await db.from("paintings").select(`
      title,
      artists (firstName, lastName)
    `);

      if (handleDbResponse(data, error, res)) return;

      const artistCounts = data.reduce((acc, item) => {
        if (!item.artists) return acc;
        const artistName = `${item.artists.firstName} ${item.artists.lastName}`;
        acc[artistName] = (acc[artistName] || 0) + 1;
        return acc;
      }, {});

      let mappedArtistCount = Object.entries(artistCounts).map(
        ([name, numOfPaintings]) => ({ name, numOfPaintings })
      );
      let sorted = mappedArtistCount.sort(
        (a, b) => b.numOfPaintings - a.numOfPaintings
      );

      res.status(200).json(sorted);
    }, "getCountForPaintingsPerArtist")
  );
};

const getCountForPaintingsPerGenreWithLimit = (app) => {
  app.get(
    "/api/counts/topgenres/:count",
    handleAsync(async (req, res) => {
      if (isNaN(req.params.count)) {
        return res
          .status(400)
          .json({ error: "Count parameter must be a number" });
      }

      const { data, error } = await db.from("paintingGenres").select(`
      genres!inner(genreName),
      paintings!inner(paintingId)
    `);

      if (handleDbResponse(data, error, res, "No paintings or genres found"))
        return;

      const genreCounts = data.reduce((acc, item) => {
        const genreName = item.genres["genreName"];
        acc[genreName] = (acc[genreName] || 0) + 1;
        return acc;
      }, {});
      let mappedGenreCount = Object.entries(genreCounts).map(
        ([genreName, numOfPaintings]) => ({ genreName, numOfPaintings })
      );
      let sorted = mappedGenreCount.sort(
        (a, b) => a.numOfPaintings - b.numOfPaintings
      );

      const filtered = sorted.filter(
        (s) => s.numOfPaintings > req.params.count
      );
      res.status(200).json(filtered);
    }, "getCountForPaintingsPerGenreWithLimit")
  ); // <-- logs to show source of error if error occurs
};

module.exports = {
  getCountForPaintingsPerGenre,
  getCountForPaintingsPerArtist,
  getCountForPaintingsPerGenreWithLimit,
};
