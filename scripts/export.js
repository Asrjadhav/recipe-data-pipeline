

const admin = require("firebase-admin");
const fs = require("fs");

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "aditi-recipe-pipeline",
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];

  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  // Ensure exports folder exists
  if (!fs.existsSync("exports")) {
    fs.mkdirSync("exports");
  }

  fs.writeFileSync(
    `exports/${collectionName}.json`,
    JSON.stringify(data, null, 2)
  );

  console.log(`✔ Exported ${collectionName} (${data.length} docs)`);
}

async function runExport() {
  console.log("📦 Exporting Firestore Emulator data...");

  await exportCollection("users");
  await exportCollection("recipes");
  await exportCollection("interactions");

  console.log("🎉 Export complete!");
}

runExport();
