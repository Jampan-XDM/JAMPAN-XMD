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

let sock;

/* 🔥 INIT WHATSAPP SOCKET */
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        startBot();
      }
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }
  });
}

/* 🚀 START BOT */
startBot();

/* STATUS */
app.get("/status", (req, res) => {
  res.json({
    status: sock ? "running" : "starting"
  });
});

/* 🔥 REAL PAIRING */
app.get("/pair", async (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({ error: "Number required" });
  }

  try {
    if (!sock) {
      return res.json({ error: "Bot not ready" });
    }

    // muhimu: namba lazima iwe bila + (mfano 255...)
    const code = await sock.requestPairingCode(number);

    res.json({
      number,
      code,
      status: "REAL PAIR CODE GENERATED"
    });

  } catch (err) {
    console.log(err);
    res.json({
      error: "Failed to generate REAL code"
    });
  }
});

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on " + PORT);
});