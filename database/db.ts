const Database = require("better-sqlite3");
const db = new Database("database.sqlite"); // ✅ Persistent database file

export const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
  `);
};

export const insertData = () => {
  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get("dev@example.com"); // ✅ Ensure user isn't inserted twice

  if (!existingUser) {
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
      "dev@example.com",
      "#ThisIsDev"
    );
  }
};

export const deleteTables = () => {
  db.exec("DROP TABLE IF EXISTS users"); // ✅ Avoid errors if table doesn't exist
};

export const initializeDatabase = () => {
  createTables();
  insertData();
};

initializeDatabase(); // ✅ Run only when this file is imported

export default db;
