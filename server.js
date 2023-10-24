const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const dbConfig = require("./app/config/db.config.js");
const db = require("./app/models");
const Role = db.role;

const app = express();

app.use(cors({ origin: "http://localhost:8083" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "ayuraid-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

mongoose
  .connect(`mongodb://127.0.0.1:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.use("/", require("./app/routes/auth.routes.js").router);
//
