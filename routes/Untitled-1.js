const express = require("express");
const app = express();
const port = 5505;

app.get("/", (req, res) => {
  res.send("Hello API 🚀");
});

app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
