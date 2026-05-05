const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// HOME
app.get("/", (req, res) => {
  res.send("SERVER RUNNING 🚀");
});

// STATUS
app.get("/status", (req, res) => {
  res.json({ status: "online" });
});

// PAIR (VERY IMPORTANT)
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});