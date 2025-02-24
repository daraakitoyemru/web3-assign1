const { db, jsonMsg } = require("./db-connect");

const galleriesSql = `"galleryId","galleryName","galleryNativeName","galleryCity","galleryAddress","galleryCountry","latitude","longitude","galleryWebSite","flickrPlaceId","yahooWoeId","googlePlaceId"`;

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

module.exports = { getAllGalleries, getGalleriesById, getGalleriesBySubstring };
