import fs from "fs";

const filePath = "./db.json"; // ton fichier json-server

fs.watchFile(filePath, (curr, prev) => {
  console.log("📝 db.json has changed!");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return console.error(err);

    try {
      const json = JSON.parse(data);
      console.log("📦 New data:", json);
    } catch (parseErr) {
      console.error("❌ Error parsing JSON:", parseErr);
    }
  });
});