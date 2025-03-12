const Database = require("better-sqlite3");
const db = new Database("database.sqlite"); // ✅ Persistent database file

export const createTables = () => {
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS users (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       email TEXT NOT NULL UNIQUE,
  //       password TEXT NOT NULL
  //   );
  // `);
  // db.exec(`
  //     CREATE TABLE IF NOT EXISTS TransactionType (
  //       id INTEGER PRIMARY KEY NOT NULL UNIQUE AUTOINCREMENT,
  //       type TEXT NOT NULL
  //     );
  // `);
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS Transaction (
  //     id INTEGER PRIMARY KEY NOT NULL UNIQUE AUTOINCREMENT,
  //     date DATETIME NOT NULL,
  //     totalPrice INTEGER NOT NULL,
  //     transactionTypeID INTEGER NOT NULL,
  //     FOREIGN KEY (transactionTypeID) REFERENCES TransactionType(id)
  //   );
  // `);
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS Vendor (
  //     id TEXT PRIMARY KEY NOT NULL UNIQUE,
  //     name TEXT NOT NULL,
  //     address TEXT,
  //     phone TEXT
  //   );
  // `);
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS Item (
  //     id TEXT PRIMARY KEY NOT NULL UNIQUE,
  //     name TEXT NOT NULL,
  //     price INTEGER NOT NULL,
  //     stockQty INTEGER NOT NULL,
  //     vendorID TEXT NOT NULL,
  //     FOREIGN KEY (vendorID) REFERENCES Vendor(id)
  //   );
  // `);
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS TransactionItem (
  //     id TEXT PRIMARY KEY NOT NULL UNIQUE,
  //     vendorID TEXT NOT NULL,
  //     qty INTEGER NOT NULL,
  //     sellPrice INTEGER NOT NULL,
  //     totalPrice INTEGER NOT NULL,
  //     transactionID INTEGER NOT NULL,
  //     FOREIGN KEY (vendorID) REFERENCES Vendor(id),
  //     FOREIGN KEY (transactionID) REFERENCES Transaction(id)
  //   );
  // `);
};

// export const insertData = () => {
//   const existingUser = db
//     .prepare("SELECT * FROM users WHERE email = ?")
//     .get("dev@example.com"); // ✅ Ensure user isn't inserted twice

//   if (!existingUser) {
//     db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
//       "dev@example.com",
//       "#ThisIsDev"
//     );
//   }

//   const transactionType = db
//   .prepare(
//     "SELECT * FROM TransactionType WHERE name = ? or name = ?"
//   )
//   .get("Transfer", "Debit");
// };

export const deleteTables = () => {
  db.exec("DROP TABLE IF EXISTS users"); // ✅ Avoid errors if table doesn't exist
};

export const initializeDatabase = () => {
  createTables();
  // insertData();
};

initializeDatabase(); // ✅ Run only when this file is imported

export default db;
