const express = require("express");
const cors = require("cors");

const erasRouter = require("./api/erasdb");
const galleriesRouter = require("./api/galleriesdb");
const artistRouter = require("./api/artistsdb");
const paintingRouter = require("./api/paintingsdb");
const genreRouter = require("./api/genredb");
const countsRouter = require("./api/counts");
const PORT = process.env.PORT;
const app = express();

// Set character encoding for proper handling of special characters
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://art-api-he4r.onrender.com", /\.onrender\.com$/],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Set response headers for proper character encoding
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.header('Accept-Charset', 'utf-8');
  // Force UTF-8 encoding for all responses
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

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

countsRouter.getCountForPaintingsPerGenre(app);
countsRouter.getCountForPaintingsPerArtist(app);
countsRouter.getCountForPaintingsPerGenreWithLimit(app);

app.listen(PORT, () => {
  console.log("Server is listening on port: " + PORT);
});
