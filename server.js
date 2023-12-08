const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();

const PORT = process.env.PORT;
const DB = process.env.MONGO_ATLAS.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

let count = 0;
const handleDisconnect = async () => {
  count++;
  console.log("Trying to connect to mongo. Attempt : " + count);

  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      if (count >= 5) {
        console.log("Mongo ERROR");
        console.error(err);
        process.exit(1);
      } else {
        setTimeout(handleDisconnect, 1000);
      }
    });
};

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
mongoose.connection.on("error", handleDisconnect);

app.use(express.json());
app.use("/api", require("./app/routes/user_routes.js"));

app.get("/", (req, res) => {
  res.end("Hello from server");
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
