const express = require("express");
const app = express();

// 🔴 WEKA HAPA (routes zote za API)
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    bot: "JAMPAN XMD",
    owner: "Kelvin Jampan"
  });
});

// homepage (optional)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});