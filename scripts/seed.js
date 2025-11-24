// seed.js — Firebase Seeding Script for Real Firestore
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
  console.log("🌱 Seeding Firestore...");

  // 1. SEED USERS
  const userIds = [];
  const users = [
    { name: "Aditi", email: "aditi@example.com" },
    { name: "John", email: "john@example.com" },
    { name: "Sara", email: "sara@example.com" },
  ];

  for (let u of users) {
    const ref = await db.collection("users").add({
      ...u,
      joinedAt: new Date(),
      profilePic: "",
    });
    userIds.push(ref.id);
  }

  console.log("Users added");

  // 2. SEED MAIN RECIPE
  const mainRecipeRef = await db.collection("recipes").add({
    title: "Uttapam (Aditi's Recipe)",
    authorId: userIds[0], // Aditi
    description: "Soft and tasty uttapam",
    prepTimeMin: 15,
    cookTimeMin: 10,
    difficulty: "easy",
    servings: 2,
    ingredients: [
      { name: "Rava (Suji)", quantity: 0.5, unit: "kg" },
      { name: "Curd", quantity: 500, unit: "ml" },
      { name: "Salt", quantity: 1, unit: "tbsp" },
      { name: "Soda", quantity: 0.5, unit: "tsp" },
      { name: "Oil", quantity: 1, unit: "tbsp" },
      { name: "Onions", quantity: 2, unit: "medium" },
      { name: "Tomatoes", quantity: 2, unit: "medium" },
      { name: "Green Chillies", quantity: 4, unit: "pieces" },
      { name: "Coriander", quantity: 1, unit: "bunch" },
      { name: "Water", quantity: 500, unit: "ml" },
    ],
    steps: [
      { stepNo: 1, text: "Take a mixing bowl." },
      { stepNo: 2, text: "Add ½ kg rava (suji) and 500 ml curd into the bowl." },
      { stepNo: 3, text: "Add all chopped vegetables (onion, tomato, chillies, coriander)." },
      { stepNo: 4, text: "Add salt and water into the bowl." },
      { stepNo: 5, text: "Mix everything gently." },
      { stepNo: 6, text: "Rest the batter for 15–20 minutes." },
      { stepNo: 7, text: "After resting, the batter is ready." },
      { stepNo: 8, text: "Add soda just before making uttapams." },
      { stepNo: 9, text: "Heat a pan on medium flame." },
      { stepNo: 10, text: "Add 1 tbsp oil to the pan." },
      { stepNo: 11, text: "Pour 70–80 ml batter onto the pan." },
      { stepNo: 12, text: "Spread gently without making too thin." },
      { stepNo: 13, text: "Cook 30–40 seconds until golden brown." },
      { stepNo: 14, text: "Flip and cook for another 30–40 seconds." },
      { stepNo: 15, text: "Serve hot on a plate." },
      { stepNo: 16, text: "Repeat for remaining batter." },
      { stepNo: 17, text: "Enjoy with chutney or sambar." },
    ],
    tags: ["breakfast", "south-indian"],
    createdAt: new Date(),
  });

  console.log("Main recipe added");

  // 3. SEED SYNTHETIC RECIPES
  const recipeIds = [mainRecipeRef.id];

  for (let i = 1; i <= 15; i++) {
    const syntheticRef = await db.collection("recipes").add({
      title: `Synthetic Recipe ${i}`,
      authorId: userIds[i % 3],
      description: "Synthetic recipe for data analytics",
      prepTimeMin: 10 + i,
      cookTimeMin: 5 + (i % 4),
      difficulty: ["easy", "medium", "hard"][i % 3],
      servings: (i % 4) + 1,
      ingredients: [{ name: `Ingredient_${i}`, quantity: 1, unit: "unit" }],
      steps: [{ stepNo: 1, text: "Dummy step" }],
      tags: ["test"],
      createdAt: new Date(),
    });

    recipeIds.push(syntheticRef.id);
  }

  console.log("Synthetic recipes added");

  // 4. FIXED INTERACTIONS
  const interactionTypes = ["view", "like", "attempt", "rating"];

  for (let i = 0; i < 30; i++) {
    const recipeId = recipeIds[Math.floor(Math.random() * recipeIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];

    await db.collection("interactions").add({
      recipeId,
      userId,
      type,
      rating: type === "rating" ? Math.floor(Math.random() * 5) + 1 : null,
      difficultyReported: ["easy", "medium", "hard"][i % 3],
      createdAt: new Date(),
    });
  }

  console.log("Interactions added");

  console.log("Seeding complete!");
}

seed().catch((err) => console.error("Error seeding data:", err));
