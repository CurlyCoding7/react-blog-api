const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);

  //Check existing user
  const selectQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
  db.query(selectQuery, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.rows.length) return res.status(409).json("User already exists");

    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (username,email,password,img) VALUES($1, $2, $3, $4)";
    const values = [
      req.body.username,
      req.body.email,
      hash,
      req.body.img.filename
    ];

    db.query(
      insertQuery,
      [req.body.username, req.body.email, hash, req.body.img.filename],
      (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json("User has been created");
      }
    );
  });
};

const login = (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);

  const q = "SELECT * FROM users WHERE username = $1";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.rows.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data.rows[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Invalid username or password!");

    const token = jwt.sign({ id: data.rows[0].id }, "jwtkey");
    const { password, ...other } = data.rows[0];

    var date = new Date();
    var tokenExpire = date.setTime(date.getTime() + 360 * 1000);
    res
      .status(200)
      .cookie("access_token", token, {
        maxAge: tokenExpire,
        httpOnly: true
      })
      .json(other);
  });
};

const logout = (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);

  res.status(200).clearCookie("access_token").json("logged out");
};

module.exports = { login, logout, signup };
