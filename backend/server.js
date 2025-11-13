// backend/server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Route that receives email and saves it
app.post("/buy", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email!" });
  }

  // Folder where we’ll save emails
  const dataDir = path.join(__dirname, "data");
  const filePath = path.join(dataDir, "emails.txt");

  // Create folder if it doesn’t exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Save email to the file
  const entry = `${new Date().toISOString()} - ${email}\n`;
  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error("Error saving email:", err);
      return res.status(500).json({ message: "Error saving email." });
    }
    console.log(`✅ New email saved: ${email}`);
    res.json({ message: "✅ Your email has been saved. Thank you!" });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
