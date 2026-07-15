const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "developer-chowk",
  brokers: ["localhost:9092"],
});

module.exports = kafka;