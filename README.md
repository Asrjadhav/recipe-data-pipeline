# Recipe Data Pipeline

A complete end-to-end data engineering pipeline built using Firebase, Node.js ETL scripts, and analytics processing.
The project extracts raw Firestore data, cleans and normalizes it, validates quality rules, and generates CSV outputs for analysis.

1. This project demonstrates a recipe data pipeline:

1) Extracts data from Firebase(users, recipes, interactions)

2) Transforms and normalizes data

3) Performs data quality validation

4) Generates CSV files for analysis

5) Provides analytics and insights on recipes and user interactions

Primary dataset includes Aditi’s Uttapam recipe and synthetic recipes for testing.


## 2. Data Model (Firestore Schema)

![Data Model](images/flow.png)

## 3. Running the Pipeline:
Prerequisites:

- Node.js v18+
- Firebase Admin SDK service account key (serviceAccountKey.json)
- Firebase project created
- Install dependencies: npm install

- Step 1 — Add Firebase Service Account
- Step 2 — Seed Firestore Data
- Step 3 — Export Data from Firestore
- Step 4 — Transform Data (ETL)
- Step 5 — Validate Data
- Step 6 — Generate Insights

## 4. ETL Process Overview
Extract: 
- Pull JSON data from production Firestore using Firebase Admin SDK.

Transform:
- Normalize nested fields (ingredients, steps)

- Convert timestamps → ISO strings

- Standardize difficulty values

- Add derived metrics:
 - totalTime = prepTimeMin + cookTimeMin
 - ingredientCount
 - stepCount

Load:

- Save all processed tables as CSV

- Save analytics summary as Markdown

## 5. Insights Summary

Your analytics script provides:

- Most attempted recipe

- Most liked recipe

- Most active user

- Average global rating

- Distribution of difficulty levels

- Engagement frequency patterns

- Example (replace with your real results):

 - Aditi’s Uttapam → Highest engagement

 - Synthetic Recipe 5 → Highest rating (4.8)

 - John → Most active user

 - 53% recipes are easy