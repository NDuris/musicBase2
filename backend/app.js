import express from "express";
import cors from "cors";
import { connection } from './database.js';
import * as sqlQueries from './sqlQueries.js'; 

const app = express();
const port = process.env.PORT || 3334;

app.listen(port);

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Node.js MusicBase REST API 🎉");
});

// SEARCH ROUTE
app.get("/search", async (request, response) => {
  const searchTerm = request.query.term; 
  const searchType = request.query.type; 

  // Define SQL queries based on search type (customize these queries as needed)
  // TODO use a switch here (looks nicer)
  let sqlQuery = "";
  if (searchType === "artist") {
    sqlQuery = `
      SELECT * FROM Artists
      WHERE ArtistName LIKE '%${searchTerm}%';
    `;
  } else if (searchType === "album") {
    sqlQuery = `
      SELECT Albums.AlbumName, Artists.ArtistName, Albums.AlbumID, Artists.ArtistID
      FROM Albums
      JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
      JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
      WHERE Albums.AlbumName LIKE '%${searchTerm}%' OR Artists.ArtistName LIKE '%${searchTerm}%';
    `;
  } else if (searchType === "track") {
    sqlQuery = `
      SELECT Tracks.TrackName, Artists.ArtistName, Albums.AlbumName, Artists.ArtistID, Albums.AlbumID
      FROM Tracks
      LEFT JOIN TrackArtists ON Tracks.TrackID = TrackArtists.TrackID
      LEFT JOIN Artists ON TrackArtists.ArtistID = Artists.ArtistID
      LEFT JOIN AlbumTracks ON Tracks.TrackID = AlbumTracks.TrackID
      LEFT JOIN Albums ON AlbumTracks.AlbumID = Albums.AlbumID
      WHERE Tracks.TrackName LIKE '%${searchTerm}%' OR Albums.AlbumName LIKE '%${searchTerm}%' OR Artists.ArtistName LIKE '%${searchTerm}%';
    `;
  }

  // Execute the SQL query with the search term
  connection.query(sqlQuery, [`%${searchTerm}%`, `%${searchTerm}%`], (error, results) => {
      if (error) {
          console.error(error);
          return response.status(500).json({ error: "Internal Server Error" });
      }

      response.json(results);
  });
});

// ARTIST ROUTES

// getting all artists
app.get("/artists", (request, response) => {
  console.log("GET /artists");
    connection.query(sqlQueries.getAllArtists(), (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results);
    });
  });

  // getting specific artist
  app.get("/artists/:id", (request, response) => {
    const id = parseInt(request.params.id);
  
    connection.query(sqlQueries.getArtistById(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results[0]);
    });
  });
  
  // creating artist
  app.post("/artists", (request, response) => {
    const { name } = request.body;  
    
    connection.query(sqlQueries.createArtist(name), [name], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.status(201).json({ message: "Artist created successfully" });
    });
  });

  // update artist
  app.put("/artists/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const { name } = request.body;

    connection.query(sqlQueries.updateArtist(id, name), [name, id], (error, results) => {   
        if (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal Server Error" });
        }

        response.json({ message: "Artist updated successfully" });
    });
  });

  // delete artist
  app.delete("/artists/:id", (request, response) => {
    const id = parseInt(request.params.id);

    connection.query(sqlQueries.deleteArtist(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json({ message: "Artist deleted successfully" });
    });
  });

// TRACK ROUTES

  // getting all tracks
  app.get("/tracks", (request, response) => {  
    connection.query(sqlQueries.getAllTracks(), (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results);
    });
  });

  // getting specific track
  app.get("/tracks/:id", (request, response) => {
    const id = parseInt(request.params.id);
  
    connection.query(sqlQueries.getAllTracks(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results[0]);
    });
  });

  // creating track
  app.post("/tracks", (request, response) => {
    const { name } = request.body;
  
    connection.query(sqlQueries.createTrack(name), [name], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.status(201).json({ message: "Track created successfully" });
    });
  });

  // update track
  app.put("/tracks/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const { name } = request.body;
  
    connection.query(sqlQueries.updateTrack(id, name), [name, id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json({ message: "Track updated successfully" });
    });
  });

  // delete track
  app.delete("/tracks/:id", (request, response) => {
    const id = parseInt(request.params.id);
  
    connection.query(sqlQueries.deleteTrack(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json({ message: "Track deleted successfully" });
    });
  });

// ALBUM ROUTES
app.get("/albums", (request, response) => {
    connection.query(sqlQueries.getAllAlbums(), (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results);
    });
  });

  app.get("/albums/:id", (request, response) => {
    const id = parseInt(request.params.id);

    connection.query(getAlbum(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json(results[0]);
    });
  });

  app.post("/albums", (request, response) => {
    const { name } = request.body;
  
    connection.query(sqlQueries.createAlbum(name), [name], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.status(201).json({ message: "Album created successfully" });
    });
  });

  app.put("/albums/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const { name } = request.body;
  
    connection.query(sqlQueries.updateAlbum(id, name), [name, id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json({ message: "Album updated successfully" });
    });
  });

  app.delete("/albums/:id", (request, response) => {
    const id = parseInt(request.params.id);
  
    connection.query(sqlQueries.deleteAlbum(id), [id], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.json({ message: "Album deleted successfully" });
    });
  });

  // ALBUMS WITH ARTISTS AND TRACKS
  app.post("/CreateAlbumWithArtistAndTracks", (request, response) => {
    const { albumName, artistName, tracks } = request.body;
    console.log(albumName, artistName, tracks);
  
    connection.query('CALL CreateAlbumWithArtistAndTracks(?, ?, ?)', [albumName, artistName, JSON.stringify(tracks)], (error, results) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
  
      response.status(201).json({ message: "Album created successfully" });
    });
  });

// getting all information about an album
app.get("/albums/:id/info", (request, response) => {
  const albumId = parseInt(request.params.id);

  // Fetch album details
  connection.query(sqlQueries.getAlbumInfo(albumId), [albumId], (error, albumResults) => {
    if (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }

    // Fetch artists associated with the album
    connection.query(sqlQueries.getAlbumArtists(albumId), [albumId], (error, artistResults) => {
      if (error) {
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }

      // Fetch tracks associated with the album
      connection.query(sqlQueries.getAlbumTracks(albumId), [albumId], (error, trackResults) => {
        if (error) {
          console.error(error);
          return response.status(500).json({ error: "Internal Server Error" });
        }

        const albumInfo = {
          album: albumResults[0],  // Assuming there is only one album with the given ID
          artists: artistResults,
          tracks: trackResults,
        };

        response.json(albumInfo);
      });
    });
  });
});

  
  
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`App listening on http://localhost:${port}`);
    console.log(`Artists Endpoint: http://localhost:${port}/artists`);
    console.log(`Tracks Endpoint: http://localhost:${port}/tracks`);
    console.log(`Albums Endpoint: http://localhost:${port}/albums`);
  });