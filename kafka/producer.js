const kafka = require("./kafka");

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer Connected");
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });

  console.log("📨 Message sent to Kafka");
};

module.exports = {
  producer,
  connectProducer,
  sendMessage,
};