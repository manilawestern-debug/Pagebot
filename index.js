const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// 👉 PALITAN MO ITO
const PAGE_ACCESS_TOKEN = "ILAGAY_MO_PAGE_ACCESS_TOKEN";
const VERIFY_TOKEN = "WEBHOOK";

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// ✅ VERIFY WEBHOOK
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ RECEIVE MESSAGE
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      for (const event of entry.messaging) {
        if (event.message && event.message.text) {
          const senderId = event.sender.id;
          const userMessage = event.message.text;

          console.log("Message:", userMessage);

          // 👉 Reply bot
          await axios.post(
            `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              recipient: { id: senderId },
              message: { text: "Reply: " + userMessage }
            }
          );
        }
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// ✅ PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running 🚀"));
