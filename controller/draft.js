const db = require("../db");
const jwt = require("jsonwebtoken");

const getDrafts = (req, res) => {
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

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "SELECT * FROM drafts WHERE uid = $1";

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.status(200).json(data.rows);
    });
  });
};

const getDraft = (req, res) => {
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

  const q =
    "SELECT d.id, username, title, description, u.img AS userImg, d.img, cat, date FROM users u JOIN drafts d ON u.id=d.uid WHERE d.id = $1";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data.rows[0]);
  });
};

const addDraft = (req, res) => {
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

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO drafts (title, description, img, cat, date, uid) VALUES($1,$2,$3,$4,$5,$6)";

    const draftImg = req.body.img.filename
      ? req.body.img.filename
      : req.body.img;

    const values = [
      req.body.title,
      req.body.description,
      draftImg,
      req.body.cat,
      req.body.date,
      userInfo.id
    ];
    db.query(q, [...values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Draft saved!!");
    });
  });
};

const deleteDarft = (req, res) => {
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

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const draftId = req.params.id;
    const q = "DELETE FROM drafts WHERE id = $1 AND uid = $2";

    db.query(q, [draftId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted");
    });
  });
};

const updateDraft = (req, res) => {
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

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE drafts SET title = $1, description = $2, img = $3, cat = $4 WHERE id = $5 AND uid = $6";
    const draftImg = req.body.img.filename
      ? req.body.img.filename
      : req.body.img;

    const values = [
      req.body.title,
      req.body.description,
      draftImg,
      req.body.cat
    ];
    const draftId = req.params.id;

    db.query(q, [...values, draftId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json(draftImg);
    });
  });
};

module.exports = { getDraft, getDrafts, addDraft, updateDraft, deleteDarft };
