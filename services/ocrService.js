const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");

async function extractTextFromPDF(pdfPath) {
  const uploadsDir = path.join(__dirname, "../uploads");
  const outputPrefix = path.join(uploadsDir, "output");

  // Clean old generated images first
  const oldFiles = fs
    .readdirSync(uploadsDir)
    .filter((f) => f.startsWith("output") && f.endsWith(".png"));

  for (const file of oldFiles) {
    fs.unlinkSync(path.join(uploadsDir, file));
  }

  // Convert PDF -> PNG images
  execSync(`pdftoppm -png -r 300 "${pdfPath}" "${outputPrefix}"`);


  const files = fs
    .readdirSync(uploadsDir)
    .filter((f) => f.startsWith("output") && f.endsWith(".png"))
    .sort();

  let fullText = "";

  for (const file of files) {
    const imagePath = path.join(uploadsDir, file);
    const enhancedPath = path.join(uploadsDir, `enhanced-${file}`);

    // Improve OCR quality
    await sharp(imagePath)
      .grayscale()
      .normalize()
      .sharpen()
      .resize({ width: 2200, withoutEnlargement: false })
      .toFile(enhancedPath);

    const result = await Tesseract.recognize(enhancedPath, "eng", {
      logger: (m) => console.log(m),
    });

    fullText += result.data.text + "\n";

    // Optional cleanup
    if (fs.existsSync(enhancedPath)) {
      fs.unlinkSync(enhancedPath);
    }
  }

  return fullText.trim();
}

module.exports = { extractTextFromPDF };



















