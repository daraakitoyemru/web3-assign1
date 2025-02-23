const express = require("express");
const router = require("./router");
const PORT = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

router.getAllEras(app);
router.getAllGalleries(app);
router.getGalleriesById(app);
router.getGalleriesBySubstring(app);
router.getAllArtists(app);
router.getArtistsById(app);
router.getArtistByLastName(app);
router.getArtistsByCountry(app);
router.getAllPaintings(app);
router.getPaintingsByTitleOrYear(app);
router.getArtistsById(app);
router.getPaintingById(app);
router.getPaintingsBySearch(app);
router.getPaintingsInRange(app);

app.listen(PORT, () => {
  console.log("Server is listening on port: " + PORT);
});
