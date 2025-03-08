const Database = require("better-sqlite3");
const db = new Database("trtw-inventory.db", { verbose: console.log });
export default db;
