const { db } = require("./db-connect");
const { handleAsync, handleDbResponse } = require("./utils/errorHandler");

const galleriesSql = `"galleryId","galleryName","galleryNativeName","galleryCity","galleryAddress","galleryCountry","latitude","longitude","galleryWebSite","flickrPlaceId","yahooWoeId","googlePlaceId"`;

const getAllGalleries = (app) => {
  app.get("/api/galleries", handleAsync(async (req, res) => {
    const { data, error } = await db.from("galleries").select(galleriesSql);
    
    if (handleDbResponse(data, error, res, "No galleries found")) return;
    
    res.status(200).json(data);
  }, "getAllGalleries"));
};

const getGalleriesById = (app) => {
  app.get("/api/galleries/:id", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("galleries")
      .select(galleriesSql)
      .eq("galleryId", req.params.id);

    if (handleDbResponse(data, error, res, `Gallery with id ${req.params.id} not found`)) return;
    
    res.status(200).json(data);
  }, "getGalleriesById"));
};

const getGalleriesBySubstring = (app) => {
  app.get("/api/galleries/country/:substring", handleAsync(async (req, res) => {
    const { data, error } = await db
      .from("galleries")
      .select(galleriesSql)
      .ilike("galleryCountry", `${req.params.substring}%`);

    if (handleDbResponse(data, error, res, `No galleries found with country matching '${req.params.substring}'`)) return;
    
    res.status(200).json(data);
  }, "getGalleriesBySubstring"));
};

module.exports = { getAllGalleries, getGalleriesById, getGalleriesBySubstring };
