import express from "express";
import { startBot, getStatus, requestPair } from "./bot.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
let currentStatus = "offline";

// Start bot system
startBot((status) => {
  currentStatus = status;
});

// API: Pair
app.post("/pair", async (req, res) => {
  const { number } = req.body;

  if (!number) return res.json({ error: "Number required" });

  try {
    const code = await requestPair(number);
    res.json({ code });
  } catch (e) {
    res.json({ error: "Failed to pair" });
  }
});

// API: Status
app.get("/status", (req, res) => {
  res.json({ status: currentStatus });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});