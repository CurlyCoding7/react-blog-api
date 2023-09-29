const pg = require("pg");
require("dotenv").config();

const db = new pg.Client({
  connectionString: process.env.DB_URL
});

db.connect();

module.exports = db;
