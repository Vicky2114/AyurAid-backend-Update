const env = require("dotenv").config({
  path: "C:/Users/91787/OneDrive/Desktop/AuthSystem/.env",
}).parsed;
// console.log(env);
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = env.PORT;

mongoose
  .connect(env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongo.");
    app.listen(PORT, () => {
      console.log("Listening on port: " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting to mongo.", err);
  });

app.use(express.json());

app.use("/api", require("./app/routes/routes.js"));
