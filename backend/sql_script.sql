Create database music_base;
use music_base;

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
