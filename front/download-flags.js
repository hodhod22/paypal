import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create flags directory if it doesn't exist
const flagsDir = path.join(__dirname, "public", "flags");
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

// Flag URLs for each language
const flags = {
  en: "https://flagcdn.com/w80/gb.png",
  sv: "https://flagcdn.com/w80/se.png",
  fa: "https://flagcdn.com/w80/ir.png",
  ar: "https://flagcdn.com/w80/sa.png",
  tr: "https://flagcdn.com/w80/tr.png",
};

// Download each flag
Object.entries(flags).forEach(([lang, url]) => {
  const filePath = path.join(flagsDir, `${lang}.png`);

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Flag for ${lang} already exists.`);
    return;
  }

  console.log(`Downloading flag for ${lang}...`);

  const file = fs.createWriteStream(filePath);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Downloaded flag for ${lang}.`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading flag for ${lang}: ${err.message}`);
    });
});

console.log("Flag download script completed.");
