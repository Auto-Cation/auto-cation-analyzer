const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from project root so test.html can load
app.use(express.static(__dirname));

// Upload route
app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Auto-Cation backend running on port ${PORT}`);
});

