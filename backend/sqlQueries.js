export const getAllArtists = () => {
    return 'SELECT * FROM Artists';
};

export const getArtistById = (id) => {
    return `
    SELECT Artists.*, GROUP_CONCAT(DISTINCT Tracks.TrackName) AS Songs, GROUP_CONCAT(DISTINCT Albums.AlbumName) AS Albums
    FROM Artists
    LEFT JOIN TrackArtists ON Artists.ArtistID = TrackArtists.ArtistID
    LEFT JOIN Tracks ON TrackArtists.TrackID = Tracks.TrackID
    LEFT JOIN AlbumArtists ON Artists.ArtistID = AlbumArtists.ArtistID
    LEFT JOIN Albums ON AlbumArtists.AlbumID = Albums.AlbumID
    WHERE Artists.ArtistID = ?
    GROUP BY Artists.ArtistID;`
};

export const createArtist = (name) => {
    return 'INSERT INTO Artists (ArtistName) VALUES (?);';
};

export const updateArtist = (id, name) => {
    return 'UPDATE Artists SET ArtistName = ? WHERE ArtistID = ?;';
};

export const deleteArtist = (id) => {
    return 'DELETE FROM Artists WHERE ArtistID = ?;';
};

export const getAllTracks = () => {
    return 'SELECT * FROM Tracks';
};

export const getTrack = (id) => {
    `
      SELECT Tracks.*, GROUP_CONCAT(DISTINCT Artists.ArtistName) AS Artists, GROUP_CONCAT(DISTINCT Albums.AlbumName) AS Albums
      FROM Tracks
      LEFT JOIN TrackArtists ON Tracks.TrackID = TrackArtists.TrackID
      LEFT JOIN Artists ON TrackArtists.ArtistID = Artists.ArtistID
      LEFT JOIN AlbumTracks ON Tracks.TrackID = AlbumTracks.TrackID
      LEFT JOIN Albums ON AlbumTracks.AlbumID = Albums.AlbumID
      WHERE Tracks.TrackID = ?
      GROUP BY Tracks.TrackID;
    `
};

export const createTrack = (name) => {
    return 'INSERT INTO Tracks (TrackName) VALUES (?);';
};

export const updateTrack = (id, name) => {
    return 'UPDATE Tracks SET TrackName = ? WHERE TrackID = ?;';
}

export const deleteTrack = (id) => {
    return 'DELETE FROM Tracks WHERE TrackID = ?;';
};

export const getAllAlbums = () => {
    return 'SELECT * FROM Albums';
};

export const getAlbum = (id) => {
    return `
        SELECT Albums.*, GROUP_CONCAT(DISTINCT Tracks.TrackName) AS Songs, GROUP_CONCAT(DISTINCT Artists.ArtistName) AS Artists
        FROM Albums
        LEFT JOIN AlbumTracks ON Albums.AlbumID = AlbumTracks.AlbumID
        LEFT JOIN Tracks ON AlbumTracks.TrackID = Tracks.TrackID
        LEFT JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
        LEFT JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
        WHERE Albums.AlbumID = ?
        GROUP BY Albums.AlbumID;
    `;
};

export const createAlbum = (name) => {
    return 'INSERT INTO Albums (AlbumName) VALUES (?);';
};

export const updateAlbum = (id, name) => {
    return 'UPDATE Albums SET AlbumName = ? WHERE AlbumID = ?;';
};

export const deleteAlbum = (id) => {
    return 'DELETE FROM Albums WHERE AlbumID = ?;';
};

export const getAlbumInfo = (albumId) => {
    return `
        SELECT
        Albums.AlbumID,
        Albums.AlbumName,
        Artists.ArtistName AS AlbumArtist
        FROM
        Albums
        JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
        JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
        WHERE
        Albums.AlbumID = ?;
    `;
};

export const getAlbumTracks = (albumId) => {
    return `
        SELECT
        Tracks.TrackName,
        Artists.ArtistName AS TrackArtist
        FROM
        AlbumTracks
        JOIN Tracks ON AlbumTracks.TrackID = Tracks.TrackID
        LEFT JOIN TrackArtists ON Tracks.TrackID = TrackArtists.TrackID
        LEFT JOIN Artists ON TrackArtists.ArtistID = Artists.ArtistID
        WHERE
        AlbumTracks.AlbumID = ?;
    `;
};

export const getAlbumArtists = (albumId) => {
    return 'SELECT a.* FROM Artists a JOIN AlbumArtists aa ON a.ArtistID = aa.ArtistID WHERE aa.AlbumID = ?';
};


export const searchArtists = (searchTerm) => {
    `SELECT * FROM Artists
      WHERE ArtistName LIKE '%${searchTerm}%';
      `};

export const searchAlbums = (searchTerm) => {
    `
      SELECT Albums.AlbumName, Artists.ArtistName, Albums.NumSongs, Albums.AlbumID, Artists.ArtistID
      FROM Albums
      JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
      JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
      WHERE Albums.AlbumName LIKE '%${searchTerm}%' OR Artists.ArtistName LIKE '%${searchTerm}%';
    `};

export const searchTracks = (searchTerm) => {
    `
      SELECT Tracks.TrackName, Artists.ArtistName, Albums.AlbumName, Artists.ArtistID, Albums.AlbumID
      FROM Tracks
      LEFT JOIN TrackArtists ON Tracks.TrackID = TrackArtists.TrackID
      LEFT JOIN Artists ON TrackArtists.ArtistID = Artists.ArtistID
      LEFT JOIN AlbumTracks ON Tracks.TrackID = AlbumTracks.TrackID
      LEFT JOIN Albums ON AlbumTracks.AlbumID = Albums.AlbumID
      WHERE Tracks.TrackName LIKE '%${searchTerm}%' OR Albums.AlbumName LIKE '%${searchTerm}%' OR Artists.ArtistName LIKE '%${searchTerm}%';
    `};