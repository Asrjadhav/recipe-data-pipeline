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
- Firebase project created
- Install project dependencies: `npm install`
- Required Node.js packages installed:
  - `firebase-admin` → To interact with Firebase Firestore
  - `csv-parser` → To read CSV files
  - `chartjs-node-canvas` → To generate charts programmatically
  - `fs` (File System module) → For reading/writing files
  - `path` → For handling file paths

## Steps
- Step 1 — Add Firebase Service Account
- Step 2 — Seed Firestore Data
- Step 3 — Export Data from Firestore
- Step 4 — Transform Data (ETL)
- Step 5 — Validate Data
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
![High_Engagement](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/high_engagement_ingredients.png)

### 6. Correlation Between Prep Time and Likes
- It Shows whether recipes with higher prep time receive more or fewer likes.
- Insight: Identifies if longer or shorter recipes tend to be more liked.
![High_Engagement](https://github.com/Asrjadhav/recipe-data-pipeline/blob/main/images/prep_vs_likes.png)

## 5. Known Constraints or Limitations


1) Dataset Size: Current pipeline works with a small dataset (Aditi’s Uttapam recipe + synthetic recipes). May need optimization for large-scale datasets.

2) User Interaction Data: Only basic interactions (like, view, attempt) are tracked; more detailed engagement metrics (time spent, favorites, comments) are not captured.

3) Static Visualizations: Charts are generated from CSV files, not dynamic dashboards; no real-time updates.

4) Ingredient Analysis: High engagement ingredients assume linear aggregation of recipe interactions; no weighting for user influence or recipe popularity trends.

5) Scalability: Pipeline is designed for educational/demo purposes and may need refactoring for production-level deployment.

6) Analytics Scope: Limited to predefined insights; no predictive modeling or recommendations implemented yet.
