# COMP 4513 (Winter 2025)

### Assignment #1: Node, SQL (via supabase)

### Overview

This repository contains code for an Art API. The assignment makes use of Node and Express to efficiently manage the server and the possible routes that may be taken. Data for eras, galleries, artists, paintings, and genres are able to be fetched from the server. The data is returned in JSON form.

![Node.js](https://img.shields.io/badge/Node.js-22.12.0-green) ![Express](https://img.shields.io/badge/Express-4.21.1-blue) ![Deployed on](https://img.shields.io/badge/Deployed%20on-Render.com-orange)

### Example:

Request: [/api/artists/12](https://art-api-he4r.onrender.com/api/artists/12)

Response:

```json
{
  "artistId": 12,
  "firstName": "Edouard",
  "lastName": "Manet",
  "nationality": "France",
  "gender": "M",
  "yearOfBirth": 1832,
  "yearOfDeath": 1883,
  "details": "Edouard Manet was a French painter. One of the first 19th-century artists to approach modern-life subjects, he was a pivotal figure in the transition from Realism to Impressionism.",
  "artistLink": "http://en.wikipedia.org/wiki/Manet"
}
```

## Project Files

| File             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| server.js        | Contains the code for the server itself and starts listening for requests. |
| data_provider.js | Fetches data from the data folder and exports it for use by the router.    |
| router.js        | Handles possible routes, filtering and returning appropriate JSON data.    |

## Testing

### Eras

- [/api/eras](https://art-api-he4r.onrender.com/api/eras)

### Galleries

- [/api/galleries](https://art-api-he4r.onrender.com/api/galleries)
- [/api/galleries/30](https://art-api-he4r.onrender.com/api/galleries/30)
- [/api/galleries/Calgary](https://art-api-he4r.onrender.com/api/galleries/Calgary)
- [/api/galleries/country/fra](https://art-api-he4r.onrender.com/api/galleries/country/fra)

### Artists

- [/api/artists](https://art-api-he4r.onrender.com/api/artists)
- [/api/artists/12](https://art-api-he4r.onrender.com/api/artists/12)
- [/api/artists/1223423](https://art-api-he4r.onrender.com/api/artists/1223423)
- [/api/artists/search/ma](https://art-api-he4r.onrender.com/api/artists/search/ma)
- [/api/artists/search/mA](https://art-api-he4r.onrender.com/api/artists/search/mA)
- [/api/artists/country/fra](https://art-api-he4r.onrender.com/api/artists/country/fra)

### Paintings

- [/api/paintings](https://art-api-he4r.onrender.com/api/paintings)
- [/api/paintings/sort/year](https://art-api-he4r.onrender.com/api/paintings/sort/year)
- [/api/paintings/63](https://art-api-he4r.onrender.com/api/paintings/63)
- [/api/paintings/search/port](https://art-api-he4r.onrender.com/api/paintings/search/port)
- [/api/paintings/search/pORt](https://art-api-he4r.onrender.com/api/paintings/search/pORt)
- [/api/paintings/search/connolly](https://art-api-he4r.onrender.com/api/paintings/search/connolly)
- [/api/paintings/years/1800/1850](https://art-api-he4r.onrender.com/api/paintings/years/1800/1850)
- [/api/paintings/galleries/5](https://art-api-he4r.onrender.com/api/paintings/galleries/5)
- [/api/paintings/artist/16](https://art-api-he4r.onrender.com/api/paintings/artist/16)
- [/api/paintings/artist/666](https://art-api-he4r.onrender.com/api/paintings/artist/666)
- [/api/paintings/artist/country/ital](https://art-api-he4r.onrender.com/api/paintings/artist/country/ital)
- [/api/paintings/genre/78](https://art-api-he4r.onrender.com/api/paintings/genre/78)
- [/api/paintings/era/2](https://art-api-he4r.onrender.com/api/paintings/era/2)

### Genres

- [/api/genres](https://art-api-he4r.onrender.com/api/genres)
- [/api/genres/76](https://art-api-he4r.onrender.com/api/genres/76)
- [/api/genres/painting/408](https://art-api-he4r.onrender.com/api/genres/painting/408)
- [/api/genres/painting/jsdfhg](https://art-api-he4r.onrender.com/api/genres/painting/jsdfhg)

### Counts

- [/api/counts/genres](https://art-api-he4r.onrender.com/api/counts/genres)
- [/api/counts/artists](https://art-api-he4r.onrender.com/api/counts/artists)
- [/api/counts/topgenres/20](https://art-api-he4r.onrender.com/api/counts/topgenres/20)
- [/api/counts/topgenres/2034958](https://art-api-he4r.onrender.com/api/counts/topgenres/2034958)
