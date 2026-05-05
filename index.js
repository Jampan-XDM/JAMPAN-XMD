const express = require("express");
const cors = require("cors");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const app = express();
app.use(cors());
app.use(express.json());

let sock = null;
let botReady = false;

/* 🔥 START BOT */
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ BOT CONNECTED");
      botReady = true;
    }

    if (connection === "close") {
      botReady = false;

      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        startBot();
      }
    }
  });
}

startBot();

/* STATUS */
app.get("/status", (req, res) => {
  res.json({
    bot: botReady ? "online" : "starting"
  });
});

/* 🔥 REAL PAIR FIXED */
app.get("/pair", async (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.json({ error: "Number required" });
  }

  if (!botReady) {
    return res.json({ error: "Bot not ready, wait few seconds" });
  }

  try {
    const code = await sock.requestPairingCode(number);

    res.json({
      number,
      code
    });

  } catch (err) {
    console.log("PAIR ERROR:", err);

    res.json({
      error: "Pair failed (check logs)"
    });
  }
});

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on " + PORT);
});