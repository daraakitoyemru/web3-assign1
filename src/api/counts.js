const { db, jsonMsg } = require("./db-connect");

const getCountForPaintingsPerGenre = (app) => {
  app.get("/api/counts/genres", async (req, res) => {
    const { data, error } = await db.from("paintingGenres").select(`
      genres!inner(genreName),
      paintings!inner(paintingId)
    `);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else {
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

      res.send(sorted);
    }
  });
};

const getCountForPaintingsPerArtist = (app) => {
  app.get("/api/counts/artists", async (req, res) => {
    const { data, error } = await db.from("paintings").select(`
      title,
      artists (firstName, lastName)
    `);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else {
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

      res.send(sorted);
    }
  });
};

const getCountForPaintingsPerGenreWithLimit = (app) => {
  app.get("/api/counts/topgenres/:count", async (req, res) => {
    const { data, error } = await db.from("paintingGenres").select(`
      genres!inner(genreName),
      paintings!inner(paintingId)
    `);

    if (error) {
      res.send(jsonMsg("Error: unable to satisfy request", error));
    } else {
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

      res.send(sorted.filter((s) => s.numOfPaintings > req.params.count));
    }
  });
};

module.exports = {
  getCountForPaintingsPerGenre,
  getCountForPaintingsPerArtist,
  getCountForPaintingsPerGenreWithLimit,
};
