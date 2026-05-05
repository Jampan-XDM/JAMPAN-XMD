const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* STATUS */
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: "JAMPAN XMD"
  });
});

/* 🔥 ADD THIS PAIR ROUTE */
app.get("/pair", (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.json({ error: "Number required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  res.json({
    number,
    code: code.toString()
  });
});

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 STATIC FRONTEND SUPPORT (kama una public folder)
app.use(express.static("public"));

/* =========================
   🌐 HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 JAMPAN XMD SERVER IS RUNNING");
});

/* =========================
   📊 STATUS ROUTE
========================= */
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: "JAMPAN XMD",
    owner: "Kelvin Jampan",
    time: new Date().toISOString()
  });
});

/* =========================
   📲 PAIRING ROUTE (DUMMY)
   👉 later replace with Baileys real pairing
========================= */
app.get("/pair", (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({
      error: "number is required"
    });
  }

  // 🔥 dummy pairing code (replace later with real WhatsApp logic)
  const code = Math.floor(100000 + Math.random() * 900000);

  res.json({
    number,
    code: code.toString(),
    status: "pair code generated",
    note: "use this code to link device"
  });
});

/* =========================
   ⚠️ 404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    error: "route not found"
  });
});

/* =========================
   🚀 START SERVER (HEROKU SAFE)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 JAMPAN XMD RUNNING ON PORT " + PORT);
});