require("dotenv").config();
const kafka = require("./kafka");
const sendEmail = require("./utils/sendEmail");

const consumer = kafka.consumer({
  groupId: "email-group",
});

const connectConsumer = async () => {
  await consumer.connect();

  console.log("✅ Kafka Consumer Connected");

  await consumer.subscribe({
    topic: "send-email",
    fromBeginning: true,
  });

  console.log("📌 Waiting for messages...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      console.log("📨 Message Received:", data);

      try {
        const info = await sendEmail({
          email: data.email,
          subject: "🎉 Welcome to Developer Chowk",
          message: `
            <h2>Welcome ${data.name}</h2>
            <p>Your account has been created successfully.</p>
            <p>Thank you for joining Developer Chowk.</p>
          `,
        });

        console.log("✅ Email Sent Successfully");
        console.log(info);
      } catch (error) {
        console.log("❌ Email Error:", error.message);
      }
    },
  });
};

module.exports = {
  connectConsumer,
};
