# Recipe Data Pipeline

A complete end-to-end data engineering pipeline built using Firebase, Node.js ETL scripts, and analytics processing.
The project extracts raw Firestore data, cleans and normalizes it, validates quality rules, and generates CSV outputs for analysis.

- This project demonstrates a recipe data pipeline:

1) Extracts data from Firebase(users, recipes, interactions)

2) Transforms and normalizes data

3) Performs data quality validation

4) Generates CSV files for analysis

5) Provides analytics and insights on recipes and user interactions

Primary dataset includes Aditi’s Uttapam recipe and synthetic recipes for testing.


## 1. Data Model (Firestore Schema)

![Data Model](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/flow.png)

## 2. Running the Pipeline:
Prerequisites:

- Node.js v18+
- Firebase Admin SDK service account key (serviceAccountKey.json)
- Firebase project with Firestore
- Install project dependencies: `npm install`
- Required Node.js packages installed:
  - `firebase-admin` → To interact with Firebase Firestore
  - `chartjs-node`-canvas → Generate charts
  - `csv-parser` → To read CSV files
  - `chartjs-node-canvas` → To generate charts programmatically
  - `fs` (File System module) → For reading/writing files
  - `path` → For handling file paths

## Steps
- Step 1 — Add Firebase Service Account(Place serviceAccountKey.json inside /config.)
- Step 2 — Seed Firestore Data (seed.js)
- Step 3 — Export Data from Firestore (export.js)
- Step 4 — Transform Data - ETL (transform.py)
- Step 5 — Validate Data (validator.py)
- Step 6 — Generate Insights

## 3. ETL Process Overview
Extract: 
- Pull JSON data from production Firestore using Firebase Admin SDK.

Transform:
- Normalize nested fields (ingredients, steps)

- Flatten Firestore structure

- Convert timestamps to ISO format

- Standardize difficulty values

- Add derived metrics:
  - totalTime = prepTimeMin + cookTimeMin
  - ingredientCount
  - stepCount

Load:

- Save all processed tables as CSV

- Save analytics summary as Markdown

- Optional visualizations

CSV files generated:
- users.csv → contains all user information
- recipes.csv → contains all recipes with normalized ingredients and steps
- interactions.csv → contains all interactions with clean ratings and types

## 4. Insights Summary
The analytics scripts provide detailed insights into recipe data, user interactions, and engagement patterns. Below are the key insights with visualizations:

### 1. Most Frequently Viewed Recipes

- Highlights recipes with the highest number of views from user interactions.
- Insight: Shows popular recipes that attract user attention.
![most_viewed_recipes](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/most_viewed_recipes.png)

### 2. Most Common Ingredients

- Shows the top 10 most frequently used ingredients across all recipes.
- Insight: Helps understand popular ingredients in the dataset.
![most_common_ingredients](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/most_common_ingredients.png)

### 3. Average Preparation Time

- It displays the average preparation time for all recipes.
- Insight: Useful for understanding recipe complexity and planning.
![avg_prep_time](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/average_prep_time.png)

### 4. Difficulty Distribution

- Distribution of recipes across difficulty levels (easy, medium, hard).
- Insight: Visualizes recipe difficulty spread for users.
- Distribution of difficulty levels
![Difficulty_distribution](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/difficulty_chart.png)

### 5. Ingredients Associated With High Engagement

- It identifies ingredients commonly found in recipes with high user engagement.
- Insight: Indicates which ingredients contribute to popular recipes.
![Ingredient_engagement](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/high_engagement_ingredients.png)

### 6. Most Active Users 
- Highlights users with the highest number of interactions (likes, attempts, views).
- Insight: Helps identify highly engaged or power users of the system.
![Active_user](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/most_active_users.png)

### 7. Highest Engagement Score (Top Recipes)

- Shows recipes with the highest combined engagement score.
- Insight: Useful to understand the most successful or trending recipes.
![High_Engagement](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/highest_engagement_score.png)

### 8. Longest vs Shortest Preparation Time

- Highlights the recipes with the maximum and minimum preparation time.
- Insight: Helps users compare extremes in recipe durations.
![Long_Short](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/prep_time_range.png)

### 9. Average Number of Steps per Recipe
- Shows the average number of steps required across all recipes.
- Insight: Gives a sense of overall recipe complexity.
![Avg_steps](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/avg_steps.png)

### . 10. Correlation Between Prep Time and Likes
- It Shows whether recipes with higher prep time receive more or fewer likes.
- Insight: Identifies if longer or shorter recipes tend to be more liked.
![Prep_like](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/prep_vs_likes.png)

## 5. Known Constraints or Limitations


- Dataset Size: Current pipeline works with a small dataset (Aditi’s Uttapam recipe + synthetic recipes). May need optimization for large-scale datasets.

- User Interaction Data: Only basic interactions (like, view, attempt) are tracked; more detailed engagement metrics (time spent, favorites, comments) are not captured.

- Static Visualizations: Charts are generated from CSV files, not dynamic dashboards; no real-time updates.

- Ingredient Analysis: High engagement ingredients assume linear aggregation of recipe interactions; no weighting for user influence or recipe popularity trends.

- Scalability: Pipeline is designed for educational/demo purposes and may need refactoring for production-level deployment.

- Analytics Scope: Limited to predefined insights; no predictive modeling or recommendations implemented yet.
