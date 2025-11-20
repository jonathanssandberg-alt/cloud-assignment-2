const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from the containerized Node.js app!//jonathan");
});

app.get("/health", (req, res) => {
  res.json({ status: "okok", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
