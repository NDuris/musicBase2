import express from "express";
import cors from "cors";
import { connection } from './database.js';
import * as sqlQueries from './sqlQueries.js'; 

const app = express();
const port = process.env.PORT || 3334;

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Node.js MusicBase REST API 🎉");
});

// ARTIST ROUTES

// getting all artists
app.get("/artists", (request, response) => {
    connection.query(sqlQueries.getAllArtists, (error, results) => {
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
  
  
  