// Express Server w/ Connections to Postgres and Redis
const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse body of incoming requests in JSON

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  databse: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", () => console.log("Lost Postgres Connection"));

// Create a table to store our data
pgClient
  .query("CREATE TABLE IF NOT EXISTS values(number INT)")
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express Route Handlers (normally include in separate file)
app.get("/", (req, res) => {
  res.send("Hi There");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows); // Avoids sending the information about query included on values
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (error, values) => {
    console.log("THESE ARE THE REDIS VALUES: ", values);
    res.send(values);
  });
  // Redis Library doesnt support Promises natively
});

app.post("/values", async (req, res) => {
  const { index } = req.body;
  console.log("THE INDEX IS: ", index);
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index, (err, reply) => {
    console.log("REPLY: ", reply);
  }); // This sends a message waking worker process to pull
  // value from Redis and begin calculating the fib number
  pgClient.query("INSERT into values(number) VALUES($1)", [index]);
  // Take index and store in Postgres (Dont understand this syntax)
  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
