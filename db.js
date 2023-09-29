const pg = require("pg");

const connectionURL =
  "postgres://shalu:7z8LZgeTlQCyB1oPiTkUYAo7Jv8pAPN1@dpg-ck7u2kg8elhc73cpp1o0-a.oregon-postgres.render.com/blogs_14uz?ssl=true";

const db = new pg.Client({
  connectionString: connectionURL
});

db.connect();

module.exports = db;

// import mysql from "mysql";

// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Shaklan@1995",
//   database: "blog",
// });

//postgres://shalu:7z8LZgeTlQCyB1oPiTkUYAo7Jv8pAPN1@dpg-ck7u2kg8elhc73cpp1o0-a.oregon-postgres.render.com/blogs_14uz
// host: dpg-ck7u2kg8elhc73cpp1o0-a
// port: 5432
// database: blogs_14uz
// user: shalu
// password: 7z8LZgeTlQCyB1oPiTkUYAo7Jv8pAPN1

// host: "localhost",
// port: 5432,
// database: "blogs",
// user: "postgres",
// password: "Shaklan@1995"
