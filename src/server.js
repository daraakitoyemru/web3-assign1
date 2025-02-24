const express = require("express");

const erasRouter = require("./api/erasdb");
const galleriesRouter = require("./api/galleriesdb");
const artistRouter = require("./api/artistsdb");
const paintingRouter = require("./api/paintingsdb");
const genreRouter = require("./api/genredb");
const PORT = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

erasRouter.getAllEras(app);

galleriesRouter.getAllGalleries(app);
galleriesRouter.getGalleriesById(app);
galleriesRouter.getGalleriesBySubstring(app);

artistRouter.getAllArtists(app);
artistRouter.getArtistsById(app);
artistRouter.getArtistByLastName(app);
artistRouter.getArtistsByCountry(app);

paintingRouter.getAllPaintings(app);
paintingRouter.getPaintingsByTitleOrYear(app);
paintingRouter.getPaintingById(app);
paintingRouter.getPaintingsBySearch(app);
paintingRouter.getPaintingsInRange(app);
paintingRouter.getPaintingsByGalleryId(app);
paintingRouter.getPaintingsByArtistId(app);
paintingRouter.getPaintingsByArtistCountry(app);
paintingRouter.getPaintingInfoFromGenreId(app);
paintingRouter.getPaintingInfoFromEraId(app);

genreRouter.getAllGenres(app);
genreRouter.getGenresById(app);
genreRouter.getGenresByPaintingId(app);

app.listen(PORT, () => {
  console.log("Server is listening on port: " + PORT);
});
