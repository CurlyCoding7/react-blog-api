const express = require("express");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const draftRoutes = require("./routes/drafts");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const cloudinary = require("./helper/cloudinaryConfig");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: true, //included origin as true
  credentials: true //included credentials as true
};

const port = process.env.PORT || 8800;

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json());
app.use("/public", express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), async function (req, res) {
  try {
    const path = `./public/${req.file.filename}`;
    const upload = await cloudinary.uploader.upload(path);
    res.status(200).json(upload.secure_url);
  } catch (error) {
    console.log(error);
  }
});

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://react-blogs-app-frontend.netlify.app/"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use("/api/drafts", draftRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("Server is listening...");
});
