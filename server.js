const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["https://auto-cation.com", "https://www.auto-cation.com"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Auto-Cation backend running on port ${PORT}`);
});





