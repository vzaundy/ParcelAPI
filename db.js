const sqlite3 = require('sqlite3').verbose();

const DB_NAME = './DBParcelAPP.db';  // Your SQLite database file
const db = new sqlite3.Database(DB_NAME, (err) => {
    if (err) {
        console.error("Failed to connect to database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

module.exports = db;