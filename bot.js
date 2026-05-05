import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import P from "pino";

let sock;
let statusCallback;

export async function startBot(cb) {
  statusCallback = cb;

  const { state, saveCreds } = await useMultiFileAuthState("./sessions");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") statusCallback("connecting");
    if (connection === "open") statusCallback("online");

    if (connection === "close") {
      statusCallback("offline");
      startBot(statusCallback);
    }
  });

  // MESSAGE HANDLER
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    const from = msg.key.remoteJid;

    if (!text) return;

    // MENU
    if (text === ".menu") {
      await sock.sendMessage(from, {
        text: `╭───( JAMPAN-XMD bot Info )───
Bot Name: DRAXEN-Ai
Owner: kelvin jampan
Version: 1.0.2
Runtime: active
╰────────────────

DOWNLOAD:
.play .video .facebook .ig .tt

AI:
.ai .image .lyrics

GROUP:
.tagall .kick .add

TOOLS:
.weather .tts .translate
`
      });
    }

    // PING
    if (text === ".ping") {
      await sock.sendMessage(from, { text: "Pong 🏓" });
    }

    // ALIVE
    if (text === ".alive") {
      await sock.sendMessage(from, {
        text: "JAMPAN-XMD is alive 🚀"
      });
    }
  });
}

// PAIRING
export async function requestPair(number) {
  if (!sock) throw new Error("Bot not started");

  const code = await sock.requestPairingCode(number);
  return code;
}

// STATUS
export function getStatus() {
  return "running";
}