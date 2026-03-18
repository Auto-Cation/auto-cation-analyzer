const express = require("express");
const multer = require("multer");
const { extractTextFromPDF } = require("../services/ocrService");
const { extractFields } = require("../services/parserService");
const { scoreDeal } = require("../services/scoringService");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-deal", upload.single("dealFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const rawText = await extractTextFromPDF(req.file.path);

    console.log("===== RAW TEXT START =====");
    console.log(rawText);
    console.log("===== RAW TEXT END =====");

    const fields = extractFields(rawText);
    const score = scoreDeal(fields);

    return res.json({
      success: true,
      fields,
      score,
      rawTextPreview: rawText.slice(0, 1000)
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      error: "Upload analysis failed.",
      details: error.message
    });
  }
});

module.exports = router;






