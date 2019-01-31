// Set-up Fibonacci Calculator Worker Process w/ Redis
const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
  console.log("Calculating Fib", index);
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
  //   This is not the most efficient solution but it will better simulate a more intensive process
}

sub.on("message", (channel, message) => {
  console.log("Setting up handler for redis inserts");
  redisClient.hset("values", message, fib(parseInt(message)));
});

sub.subscribe("insert");
