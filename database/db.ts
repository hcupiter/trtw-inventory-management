const Database = require("better-sqlite3");
const db = new Database("database.sqlite"); // ✅ Persistent database file

// Enable foreign key support
db.pragma("foreign_keys = ON");

export default db;
