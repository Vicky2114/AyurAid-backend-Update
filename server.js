const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["https://ayur-aid-web.vercel.app", "http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

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

app.use("/api/wakeUp", (req, res) => {
  res.status(200).json({ data: { message: "Hello from server" } });
});
app.use("/api/auth", require("./app/routes/auth_routes.js"));
app.use("/api/blog", require("./app/routes/blog_routes.js"));
app.use("/api/dose", require("./app/routes/dose_routes.js"));
app.use("/api/user", require("./app/routes/user_routes.js"));

app.get("/", (req, res) => {
  res.end("Hello from server");
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
