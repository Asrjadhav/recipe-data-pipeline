const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const width = 900; 
const height = 600; 
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

// 1. Difficulty distribution chart as Pie (shades of blue)
async function difficultyDistribution(recipes) {
  const counts = { easy: 0, medium: 0, hard: 0 };
  recipes.forEach((r) => counts[r.difficulty]++);
  const config = {
    type: "pie",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Number of Recipes",
        data: Object.values(counts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(54, 162, 235, 0.3)"
        ]
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: "Difficulty Distribution", font: { size: 20 } },
        legend: { position: "top" }
      }
    }
  };
  await generateChart(config, "difficulty_chart.png");
}

// 2. Prep Time vs Likes (line chart)
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
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
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

// 3. Most common ingredients (bar chart, shades of blue)
async function mostCommonIngredients(ingredients) {
  const freq = {};
  ingredients.forEach((i) => { const name = i.name.toLowerCase(); freq[name] = (freq[name] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sorted.map(([name]) => name);
  const data = sorted.map(([_, count]) => count);

  const config = {
    type: "bar",
    data: { 
      labels, 
      datasets: [{
        label: "Frequency",
        data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(54, 162, 235, 0.3)",
          "rgba(54, 162, 235, 0.9)",
          "rgba(54, 162, 235, 0.65)",
          "rgba(54, 162, 235, 0.55)",
          "rgba(54, 162, 235, 0.45)"
        ]
      }]
    },
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

// 4. High engagement ingredients (line chart, blue shades)
async function highEngagementIngredients(ingredients, interactions) {
  // Map recipeId → total engagement (like + attempt)
  const recipeEngagement = {};
  interactions.forEach(i => {
    if (["like", "attempt"].includes(i.type)) 
      recipeEngagement[i.recipeId] = (recipeEngagement[i.recipeId] || 0) + 1;
  });

  // Map ingredient → sum of engagement from all recipes containing it
  const ingredientEngagement = {};
  ingredients.forEach(i => {
    const engagement = recipeEngagement[i.recipeId] || 0;
    const name = i.name.toLowerCase();
    ingredientEngagement[name] = (ingredientEngagement[name] || 0) + engagement;
  });

  const sorted = Object.entries(ingredientEngagement)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = sorted.map(([name]) => name);
  const data = sorted.map(([_, count]) => count);

  const backgroundColors = [
    "rgba(54, 162, 235, 0.9)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(54, 162, 235, 0.4)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(54, 162, 235, 0.15)",
    "rgba(54, 162, 235, 0.1)"
  ];

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Engagement Score",
        data,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      indexAxis: 'y', // Horizontal bar chart
      plugins: {
        title: { display: true, text: "High Engagement Ingredients", font: { size: 20 } },
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, title: { display: true, text: "Engagement Score" } },
        y: { title: { display: true, text: "Ingredients" } }
      }
    }
  };

  await generateChart(config, "high_engagement_ingredients.png");
}


// 5. Average preparation time (bar chart, blue)
async function averagePrepTime(recipes) {
  const labels = recipes.map(r => r.title);
  const prepTimes = recipes.map(r => Number(r.prepTimeMin));

  const config = {
    type: "bar",
    data: { labels, datasets: [{ label: "Prep Time (min)", data: prepTimes, backgroundColor: "#1E90FF" }] },
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

//6. Most frequently viewed recipes (bar chart, blue)
async function mostViewedRecipes(recipes, interactions) {
  const viewCounts = {};
  interactions.forEach(i => { if (i.type === "view") { const rid = i.recipe_id || i.recipeId; viewCounts[rid] = (viewCounts[rid] || 0) + 1; } });

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
    data: { labels, datasets: [{ label: "Views", data: counts, backgroundColor: "#1E90FF" }] },
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

//  8.Highest Engagement Score (likes + views + attempts)
async function engagementScore(recipes, interactions) {
  const scoreMap = {};

  interactions.forEach(i => {
    if (["like", "attempt", "view"].includes(i.type)) {
      scoreMap[i.recipeId] = (scoreMap[i.recipeId] || 0) + 1;
    }
  });

  const labels = [];
  const scores = [];

  recipes.forEach(r => {
    labels.push(r.title);
    scores.push(scoreMap[r.recipeId] || 0);
  });

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Engagement Score",
        data: scores,
        backgroundColor: "rgba(30, 144, 255, 0.8)"
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Highest Engagement Score",
          font: { size: 22 }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  };

  await generateChart(config, "highest_engagement_score.png");
}
// 9. Most Active Users
async function mostActiveUsers(interactions) {
  const userMap = {};

  interactions.forEach(i => {
    userMap[i.userId] = (userMap[i.userId] || 0) + 1;
  });

  const sorted = Object.entries(userMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const labels = sorted.map(([user]) => user);
  const counts = sorted.map(([_, count]) => count);

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Activity Count",
        data: counts,
        backgroundColor: "rgba(30, 144, 255, 0.8)"
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Most Active Users",
          font: { size: 22 }
        }
      },
      scales: { y: { beginAtZero: true } }
    }
  };

  await generateChart(config, "most_active_users.png");
}

// 10. Average Steps per Recipe (FIXED)
async function avgSteps(steps) {
  const stepMap = {};

  steps.forEach(s => {
    const rid = s.recipeId || s.recipe_id;
    stepMap[rid] = (stepMap[rid] || 0) + 1;
  });

  const values = Object.values(stepMap);
  const avg = values.length > 0 
    ? values.reduce((a, b) => a + b, 0) / values.length 
    : 0;

  const config = {
    type: "bar",
    data: {
      labels: ["Average Steps per Recipe"],
      datasets: [{
        label: "Average Steps",
        data: [avg],
        backgroundColor: "rgba(54, 162, 235, 0.8)"
      }]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: "Average Number of Steps Per Recipe",
          font: { size: 22 }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  };

  await generateChart(config, "avg_steps.png");
}

// 11. Longest vs Shortest Prep Time
// 6. Longest vs Shortest Prep Time (FIXED)
async function prepTimeRanges(recipes) {
  const cleaned = recipes
    .filter(r => r.prepTimeMin && !isNaN(r.prepTimeMin))
    .map(r => ({
      title: r.title,
      prep: Number(r.prepTimeMin)
    }));

  if (cleaned.length < 2) {
    console.log("⚠ Not enough valid prep-time data to generate chart.");
    return;
  }

  const sorted = cleaned.sort((a, b) => a.prep - b.prep);

  const labels = [
    `${sorted[0].title} (Shortest)`,
    `${sorted[sorted.length - 1].title} (Longest)`
  ];

  const data = [
    sorted[0].prep,
    sorted[sorted.length - 1].prep
  ];

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Prep Time (min)",
        data,
        backgroundColor: "rgba(30,144,255,0.8)"
      }]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: "Longest vs Shortest Preparation Time",
          font: { size: 22 }
        }
      },
      scales: { y: { beginAtZero: true } }
    }
  };

  await generateChart(config, "prep_time_range.png");
}
// 12. Average Ingredients Per Recipe
async function avgIngredientsPerRecipe(ingredients) {
  const ingredientCount = {};

  ingredients.forEach(i => {
    const rid = i.recipeId || i.recipe_id;
    ingredientCount[rid] = (ingredientCount[rid] || 0) + 1;
  });

  const values = Object.values(ingredientCount);

  const avg =
    values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

  const config = {
    type: "bar",
    data: {
      labels: ["Average Ingredients per Recipe"],
      datasets: [
        {
          label: "Ingredients Count",
          data: [avg],
          backgroundColor: "rgba(54, 162, 235, 0.8)",
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: "Average Number of Ingredients Per Recipe",
          font: { size: 22 },
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  };

  await generateChart(config, "avg_ingredients.png");
}
// Main
async function run() {
  try {
    const recipes = await readCSV("recipes.csv");
    const ingredients = await readCSV("ingredients.csv");
    const interactions = await readCSV("interactions.csv");
    const steps = await readCSV("steps.csv");

    await difficultyDistribution(recipes);
    await prepTimeVsLikes(recipes, interactions);
    await mostCommonIngredients(ingredients);
    await highEngagementIngredients(ingredients, interactions);
    await averagePrepTime(recipes);
    await mostViewedRecipes(recipes, interactions);

    await highEngagementIngredients(ingredients, interactions);
    await engagementScore(recipes, interactions);
    await avgIngredientsPerRecipe(ingredients);
    await mostActiveUsers(interactions);
    await avgSteps(steps);
    await prepTimeRanges(recipes);

    console.log("🎉 All charts generated successfully!");
  } catch (err) {
    console.error("❌ Error generating charts:", err);
  }
}

run();
