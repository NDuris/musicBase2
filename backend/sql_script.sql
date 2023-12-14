-- Artists Table
CREATE TABLE Artists (
    ArtistID INT PRIMARY KEY AUTO_INCREMENT,
    ArtistName VARCHAR(255) NOT NULL
);

-- Albums Table
CREATE TABLE Albums (
    AlbumID INT PRIMARY KEY AUTO_INCREMENT,
    AlbumName VARCHAR(255) NOT NULL
);

-- Tracks Table
CREATE TABLE Tracks (
    TrackID INT PRIMARY KEY AUTO_INCREMENT,
    TrackName VARCHAR(255) NOT NULL
);

-- TrackArtists Table (Junction Table)
CREATE TABLE TrackArtists (
    TrackID INT,
    ArtistID INT,
    PRIMARY KEY (TrackID, ArtistID),
    FOREIGN KEY (TrackID) REFERENCES Tracks(TrackID),
    FOREIGN KEY (ArtistID) REFERENCES Artists(ArtistID)
);

-- AlbumArtists Table (Junction Table)
CREATE TABLE AlbumArtists (
    AlbumID INT,
    ArtistID INT,
    PRIMARY KEY (AlbumID, ArtistID),
    FOREIGN KEY (AlbumID) REFERENCES Albums(AlbumID),
    FOREIGN KEY (ArtistID) REFERENCES Artists(ArtistID)
);

-- AlbumTracks Table (Junction Table)
CREATE TABLE AlbumTracks (
    AlbumID INT,
    TrackID INT,
    PRIMARY KEY (AlbumID, TrackID),
    FOREIGN KEY (AlbumID) REFERENCES Albums(AlbumID),
    FOREIGN KEY (TrackID) REFERENCES Tracks(TrackID)
);

DELIMITER //
CREATE PROCEDURE CreateOrGetArtist(IN artistName VARCHAR(255), OUT artistId INT)
BEGIN
  DECLARE existingArtistId INT;

  SELECT ArtistID INTO existingArtistId FROM Artists WHERE ArtistName = artistName LIMIT 1;

  IF existingArtistId IS NULL THEN
    -- Kunstneren eksisterer ikke, opret en ny
    INSERT INTO Artists (ArtistName) VALUES (artistName);
    SET artistId = LAST_INSERT_ID();
  ELSE
    -- Kunstneren eksisterer, brug den eksisterende id
    SET artistId = existingArtistId;
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CreateAlbumWithArtistAndTracks(IN albumName VARCHAR(255), IN artistName VARCHAR(255), IN tracks JSON)
BEGIN
  DECLARE artistId INT;

  -- Opret eller hent kunstneren
  CALL CreateOrGetArtist(artistName, artistId);

  -- Opret album
  INSERT INTO Albums (AlbumName) VALUES (albumName);
  SET @albumId = LAST_INSERT_ID();

  -- Opret forbindelsen mellem album og kunstner
  INSERT INTO AlbumArtists (AlbumID, ArtistID) VALUES (@albumId, artistId);

  -- Opret tracks
  SET @trackIndex = 0;
  WHILE JSON_UNQUOTE(JSON_EXTRACT(tracks, CONCAT('$[', @trackIndex, '].name'))) IS NOT NULL DO
    SET @trackName = JSON_UNQUOTE(JSON_EXTRACT(tracks, CONCAT('$[', @trackIndex, '].name')));

    -- Opret eller hent tracket
    SELECT TrackID INTO @trackId FROM Tracks WHERE TrackName = @trackName LIMIT 1;
    IF @trackId IS NULL THEN
      INSERT INTO Tracks (TrackName) VALUES (@trackName);
      SET @trackId = LAST_INSERT_ID();
    END IF;

    -- Opret forbindelsen mellem album og track
    INSERT INTO AlbumTracks (AlbumID, TrackID) VALUES (@albumId, @trackId);

    SET @trackIndex = @trackIndex + 1;
  END WHILE;
END //
DELIMITER ;




