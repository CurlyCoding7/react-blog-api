const db = require("../db");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) => {
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

  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = $1"
    : "SELECT * FROM posts";

  if (req.query.cat) {
    await db.query(q, [req.query.cat], (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json(data.rows);
    });
  } else {
    await db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json(data.rows);
    });
  }
};

const getPost = (req, res) => {
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
    "SELECT p.id, username, title, description, u.img AS userimg, p.img, cat, date FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = $1";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data.rows[0]);
  });
};

const addPost = (req, res) => {
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
      "INSERT INTO posts (title, description, img, cat, date, uid) VALUES($1, $2, $3, $4, $5, $6)";

    const postImg = req.body.img.filename
      ? req.body.img.filename
      : req.body.img;

    const values = [
      req.body.title,
      req.body.description,
      postImg,
      req.body.cat,
      req.body.date,
      userInfo.id
    ];

    db.query(q, [...values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json(req.body.img.filename);
    });
  });
};

const deletePost = (req, res) => {
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

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = $1 AND uid = $2";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted");
    });
  });
};

const updatePost = (req, res) => {
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
      "UPDATE posts SET title = $1, description = $2, img = $3, cat = $4 WHERE id = $5 AND uid = $6";
    const postImg = req.body.img.filename
      ? req.body.img.filename
      : req.body.img;

    const values = [
      req.body.title,
      req.body.description,
      postImg,
      req.body.cat
    ];
    const postId = req.params.id;

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.json(req.body.img.filename);
    });
  });
};

module.exports = { getPost, getPosts, addPost, deletePost, updatePost };
