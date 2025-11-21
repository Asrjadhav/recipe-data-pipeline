import pandas as pd

print("\n🔍 Running Analytics...\n")

recipes = pd.read_csv("output/recipes.csv")
ingredients = pd.read_csv("output/ingredients.csv")
steps = pd.read_csv("output/steps.csv")
users = pd.read_csv("output/users.csv")
interactions = pd.read_csv("output/interactions.csv")

# 1. Most common ingredients
most_common_ingredients = ingredients["name"].value_counts()

print("🍽️ Most Common Ingredients:")
print(most_common_ingredients.head(), "\n")

# 2. Average preparation time
print("⏱️ Average Preparation Time:", recipes["prepTimeMin"].mean(), "minutes\n")

# 3. Difficulty distribution
print("📊 Difficulty Distribution:")
print(recipes["difficulty"].value_counts(), "\n")

# 4. Correlation between prep time and likes

# FIXED PART — Series → DataFrame
recipe_likes = (
    interactions[interactions["type"] == "like"]
    .groupby("recipeId")["rating"]
    .mean()
    .reset_index(name="avgLikes")
)

merged = recipes.merge(recipe_likes, on="recipeId", how="left")

correlation = merged["prepTimeMin"].corr(merged["avgLikes"])
print("📈 Correlation between Prep Time & Likes:", correlation, "\n")

# 5. Most frequently viewed recipes
views = interactions[interactions["type"] == "view"].groupby("recipeId").size()

print("🔥 Top Viewed Recipes:")
print(views.sort_values(ascending=False).head(), "\n")

# 6. Ingredients associated with high engagement
likes = interactions[interactions["type"] == "like"].groupby("recipeId").size().reset_index(name="likes")
recipe_with_likes = recipes.merge(likes, on="recipeId", how="left")

top_liked_recipes = recipe_with_likes.sort_values("likes", ascending=False).head()

print("🥇 Ingredients Associated With High Engagement:")
for _, row in top_liked_recipes.iterrows():
    print(f"Recipe: {row['title']}")
    ing = ingredients[ingredients["recipeId"] == row["recipeId"]]
    print("Ingredients:", ", ".join(ing["name"].tolist()))
    print()

print("🎉 Analytics Done!")
