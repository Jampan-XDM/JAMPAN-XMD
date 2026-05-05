const express = require("express");
const cors = require("cors");

const app = express();

/* ========= MIDDLEWARE ========= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= HOME ========= */
app.get("/", (req, res) => {
  res.send("🚀 JAMPAN XMD SERVER RUNNING");
});

/* ========= STATUS ========= */
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: "JAMPAN XMD",
    owner: "Kelvin Jampan",
    time: new Date().toISOString()
  });
});

/* ========= PAIR (8 DIGIT) ========= */
app.get("/pair", (req, res) => {
  const number = req.query.number;

  if (!number) {
    return res.status(400).json({
      error: "Number is required"
    });
  }

  // 8 digit code (format ya WhatsApp)
  const code = Math.floor(10000000 + Math.random() * 90000000);

  res.json({
    number,
    code: code.toString(),
    status: "Pair code generated"
  });
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