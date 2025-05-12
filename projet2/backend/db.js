import { MongoClient } from "mongodb";

async function main() {
  const uri = "mongodb+srv://goubaataoufik:user19821@cluster0.9vdaswk.mongodb.net/";
  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db("test");
  const changeStream = db.watch();

  // on écoute tous les changements sur la collection “Factures”
  //const changeStream = collection.watch();

  console.log("🔍 En attente de changements sur 'db test'…");
  changeStream.on("change", (change) => {
    console.log("⚡ Changement détecté :", change);
    // ex. { operationType: 'insert', fullDocument: {...}, documentKey: {...}, ... }
  });
}

main().catch(console.error);