const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

var cors = require("cors");
var app = express();

app.use(cors());

const {
  MONGO_USER,
  MONGO_IP,
  MONGO_PORT,
  MONGO_PASSWORD,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

app.enable("trust proxy");
const redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
redisClient.on("error", function (err) {
  console.log("Could not establish a connection with redis. " + err);
});
redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});
//Configure session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
  })
);
// //  27017 is the default if you never changed the default
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("succesfully connected"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 500);
    });
};

connectWithRetry();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcomeco s Fuck</h1>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
