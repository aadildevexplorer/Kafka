require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const connectDB = require("./Config/db");
const { connectProducer } = require("./kafka/producer");
const { connectConsumer } = require("./kafka/consumer");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to the Authentication API 1.0",
  });
});

app.use("/api/user/auth", require("./route/userRoute"));

(async () => {
  await connectProducer();
  await connectConsumer();
})();

app.listen(PORT, (req, res) => {
  console.log(`server is running on PORT : ${PORT}`);
});
