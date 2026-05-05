import express from 'express';
import { Boom } from '@hapi/boom';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Environment configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_FOLDER = process.env.WHATSAPP_SESSION_FOLDER || './sessions';
const OWNER_PHONE_NUMBER = process.env.OWNER_PHONE_NUMBER;

if (!fs.existsSync(SESSION_FOLDER)) {
  fs.mkdirSync(SESSION_FOLDER);
}

let OTPs = {}; // Store pairing OTPs in-memory; reset periodically

// Baileys session management
const connectToWhatsApp = async (number) => {
  const { state, saveCreds } = await useMultiFileAuthState(`${SESSION_FOLDER}/${number}`);

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed:', shouldReconnect ? 'Reconnecting...' : 'Logged out');
      if (shouldReconnect) connectToWhatsApp(number);
    } else if (connection === 'open') {
      console.log(`WhatsApp connected for ${number}`);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
};

// Routes for pairing
app.use(express.json());

app.post('/pair', (req, res) => {
  const { phone } = req.body;
  if (!/^\+\d{10,15}$/.test(phone)) {
    return res.status(400).send({ message: 'Invalid phone number format' });
  }

  // Generate OTP and save it
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  OTPs[phone] = otp;
  setTimeout(() => delete OTPs[phone], 300000); // OTP expires after 5 mins
  console.log(`Pairing request for ${phone}, OTP: ${otp}`);

  res.json({ message: 'OTP generated, please verify.', otp });
});

app.post('/verify', async (req, res) => {
  const { phone, otp } = req.body;
  if (OTPs[phone] === otp) {
    delete OTPs[phone];
    await connectToWhatsApp(phone);
    res.json({ message: 'Phone paired successfully.' });
  } else {
    res.status(401).send({ message: 'Invalid or expired OTP.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
