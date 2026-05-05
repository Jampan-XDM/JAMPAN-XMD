const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   🔧 MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
   📲 PAIR ROUTE
========================= */
app.get("/pair", (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({
      error: "Number is required"
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  res.json({
    number,
    code: code.toString(),
    status: "Pair code generated"
  });
});

/* =========================
   ⚠️ 404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});