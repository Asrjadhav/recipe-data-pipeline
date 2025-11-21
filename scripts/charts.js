const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const width = 900; // canvas width
const height = 600; // canvas height
const outputDir = path.join(__dirname, "../Images");
const csvFolder = path.join(__dirname, "../output");

// Ensure Images folder exists
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Helper to read CSV
function readCSV(fileName) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(csvFolder, fileName))
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// Chart generator
async function generateChart(configuration, fileName) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(outputDir, fileName), buffer);
  console.log(`✅ Saved chart: ${fileName}`);
}

// Difficulty distribution chart
async function difficultyDistribution(recipes) {
  const counts = { easy: 0, medium: 0, hard: 0 };
  recipes.forEach((r) => counts[r.difficulty]++);
  const config = {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{ label: "Number of Recipes", data: Object.values(counts), backgroundColor: "#36A2EB" }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Difficulty Distribution", font: { size: 20 } },
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Number of Recipes" } },
        x: { title: { display: true, text: "Difficulty" } }
      }
    }
  };
  await generateChart(config, "difficulty_chart.png");
}

// Prep Time vs Likes (line chart)
async function prepTimeVsLikes(recipes, interactions) {
  const likesMap = {};
  interactions.forEach((i) => {
    if (i.type === "like") likesMap[i.recipeId] = (likesMap[i.recipeId] || 0) + 1;
  });

  const labels = recipes.map((r) => r.title);
  const prepTimes = recipes.map((r) => Number(r.prepTimeMin));
  const likes = recipes.map((r) => likesMap[r.id] || 0);

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Likes vs Prep Time",
        data: prepTimes.map((t, i) => ({ x: t, y: likes[i] })),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.3,
        pointRadius: 5
      }]
    },
    options: {
      responsive: false,
      plugins: {
        title: { display: true, text: "Preparation Time vs Likes", font: { size: 24 } },
        legend: { position: "top" }
      },
      scales: {
        x: { title: { display: true, text: "Prep Time (min)" } },
        y: { title: { display: true, text: "Likes" }, beginAtZero: true }
      }
    }
  };
  await generateChart(config, "prep_vs_likes.png");
}

// Most common ingredients (light purple)
async function mostCommonIngredients(ingredients) {
  const freq = {};
  ingredients.forEach((i) => { const name = i.name.toLowerCase(); freq[name] = (freq[name] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sorted.map(([name]) => name);
  const data = sorted.map(([_, count]) => count);

  const config = {
    type: "bar",
    data: { labels, datasets: [{ label: "Frequency", data, backgroundColor: "rgba(153, 102, 255, 0.8)" }] },
    options: {
      plugins: { title: { display: true, text: "Most Common Ingredients", font: { size: 20 } }, legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Frequency" } },
        x: { title: { display: true, text: "Ingredients" } }
      }
    }
  };
  await generateChart(config, "most_common_ingredients.png");
}

// High engagement ingredients (light purple)
async function highEngagementIngredients(ingredients, interactions) {
  // Map recipeId → total interactions (like + attempt)
  const recipeEngagement = {};
  interactions.forEach(i => {
    if (["like", "attempt"].includes(i.type)) recipeEngagement[i.recipeId] = (recipeEngagement[i.recipeId] || 0) + 1;
  });

  // Map ingredient → sum of engagement from all recipes containing it
  const ingredientEngagement = {};
  ingredients.forEach(i => {
    const engagement = recipeEngagement[i.recipeId] || 0;
    const name = i.name.toLowerCase();
    ingredientEngagement[name] = (ingredientEngagement[name] || 0) + engagement;
  });

  const sorted = Object.entries(ingredientEngagement).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sorted.map(([name]) => name);
  const data = sorted.map(([_, count]) => count);

  const config = {
    type: "bar",
    data: { labels, datasets: [{ label: "Engagement Score", data, backgroundColor: "rgba(153, 102, 255, 0.8)" }] },
    options: {
      plugins: { title: { display: true, text: "High Engagement Ingredients", font: { size: 20 } }, legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Engagement Score" } },
        x: { title: { display: true, text: "Ingredients" } }
      }
    }
  };
  await generateChart(config, "high_engagement_ingredients.png");
}

// Average preparation time per recipe (bar)
async function averagePrepTime(recipes) {
  const labels = recipes.map(r => r.title);
  const prepTimes = recipes.map(r => Number(r.prepTimeMin));

  const config = {
    type: "bar",
    data: { labels, datasets: [{ label: "Prep Time (min)", data: prepTimes, backgroundColor: "#36A2EB" }] },
    options: {
      plugins: { title: { display: true, text: "Average Preparation Time per Recipe", font: { size: 20 } }, legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Prep Time (min)" } },
        x: { title: { display: true, text: "Recipes" }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 } }
      }
    }
  };
  await generateChart(config, "average_prep_time.png");
}

// Most frequently viewed recipes
async function mostViewedRecipes(recipes, interactions) {
  const viewCounts = {};
  interactions.forEach(i => {
    if (i.type === "view") {
      const rid = i.recipe_id || i.recipeId; // handle actual column name
      viewCounts[rid] = (viewCounts[rid] || 0) + 1;
    }
  });

  const labels = [];
  const counts = [];
  recipes.forEach(r => {
    const rid = r.id || r.recipeId;
    if (viewCounts[rid]) {
      labels.push(r.title);
      counts.push(viewCounts[rid]);
    }
  });

  const config = {
    type: "bar",
    data: { labels, datasets: [{ label: "Views", data: counts, backgroundColor: "#36A2EB" }] },
    options: {
      plugins: { title: { display: true, text: "Most Frequently Viewed Recipes", font: { size: 20 } }, legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Views" } },
        x: { title: { display: true, text: "Recipes" }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 } }
      }
    }
  };

  await generateChart(config, "most_viewed_recipes.png");
}

// Main
async function run() {
  try {
    const recipes = await readCSV("recipes.csv");
    const ingredients = await readCSV("ingredients.csv");
    const interactions = await readCSV("interactions.csv");

    await difficultyDistribution(recipes);
    await prepTimeVsLikes(recipes, interactions);
    await mostCommonIngredients(ingredients);
    await highEngagementIngredients(ingredients, interactions);
    await averagePrepTime(recipes);
    await mostViewedRecipes(recipes, interactions);

    console.log("🎉 All charts generated successfully!");
  } catch (err) {
    console.error("❌ Error generating charts:", err);
  }
}

run();
