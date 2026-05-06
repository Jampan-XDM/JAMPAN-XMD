const express = require("express");
const cors = require("cors");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const app = express();

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json());

/* ========= GLOBAL VARS ========= */
let sock = null;
let botReady = false;

/* ========= START BOT ========= */
async function startBot() {
  try {
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
          console.log("🔄 Reconnecting...");
          startBot();
        }
      }
    });

  } catch (err) {
    console.log("BOT START ERROR:", err);
  }
}

/* START BOT */
startBot();

/* ========= HOME ========= */
app.get("/", (req, res) => {
  res.send("🚀 JAMPAN XMD RUNNING");
});

/* ========= STATUS ========= */
app.get("/status", (req, res) => {
  res.json({
    bot: botReady ? "online" : "starting"
  });
});

/* ========= PAIR ========= */
app.get("/pair", async (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.json({ error: "Number required" });
  }

  if (!sock || !sock.user) {
    return res.json({
      error: "Bot not connected yet, wait..."
    });
  }

  try {
    const code = await sock.requestPairingCode(number);

    res.json({
      number,
      code,
      message: "Enter this code IMMEDIATELY on WhatsApp"
    });

  } catch (err) {
    console.log(err);

    res.json({
      error: "Pair failed"
    });
  }
});

/* ========= 404 ========= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

/* ========= SERVER ========= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});