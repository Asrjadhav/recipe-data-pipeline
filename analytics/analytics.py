import pandas as pd

print("\n🔍 Running Analytics...\n")

recipes = pd.read_csv("../output/recipes.csv")
ingredients = pd.read_csv("../output/ingredients.csv")
steps = pd.read_csv("../output/steps.csv")
users = pd.read_csv("../output/users.csv")
interactions = pd.read_csv("../output/interactions.csv")

# 1. Most common ingredients
most_common_ingredients = ingredients["name"].value_counts()

print("Most Common Ingredients:")
print(most_common_ingredients.head(), "\n")

# 2. Average preparation time
print("⏱Average Preparation Time:", recipes["prepTimeMin"].mean(), "minutes\n")

# 3. Difficulty distribution
print("Difficulty Distribution:")
print(recipes["difficulty"].value_counts(), "\n")

# 4. Correlation between prep time and likes
recipe_likes = (
    interactions[interactions["type"] == "like"]
    .groupby("recipeId")["rating"]
    .mean()
    .reset_index(name="avgLikes")
)

merged = recipes.merge(recipe_likes, on="recipeId", how="left")

correlation = merged["prepTimeMin"].corr(merged["avgLikes"])
print("Correlation between Prep Time & Likes:", correlation, "\n")

# 5. Most frequently viewed recipes
views = interactions[interactions["type"] == "view"].groupby("recipeId").size()

print("Top Viewed Recipes:")
print(views.sort_values(ascending=False).head(), "\n")

# 6. Ingredients associated with high engagement
likes = interactions[interactions["type"] == "like"].groupby("recipeId").size().reset_index(name="likes")
recipe_with_likes = recipes.merge(likes, on="recipeId", how="left")

top_liked_recipes = recipe_with_likes.sort_values("likes", ascending=False).head()

print("Ingredients Associated With High Engagement:")
for _, row in top_liked_recipes.iterrows():
    print(f"Recipe: {row['title']}")
    ing = ingredients[ingredients["recipeId"] == row["recipeId"]]
    print("Ingredients:", ", ".join(ing["name"].tolist()))
    print()

# 7. Highest Engagement Score (likes + views + attempts)
engagement = interactions.groupby("recipeId").size().reset_index(name="engagementScore")
top_engaged = recipes.merge(engagement, on="recipeId", how="left").sort_values("engagementScore", ascending=False)

print("Highest Engagement Score (Top 5 Recipes):")
print(top_engaged[["title", "engagementScore"]].head(), "\n")

# 8. Average number of ingredients per recipe
ingredients_count = ingredients.groupby("recipeId").size().mean()
print("Average Number of Ingredients per Recipe:", round(ingredients_count, 2), "\n")

# 9. Most active users
user_activity = interactions.groupby("userId").size().sort_values(ascending=False)

print("Most Active Users (Top 5):")
print(user_activity.head(), "\n")

# 10. Average number of steps per recipe
avg_steps = steps.groupby("recipeId").size().mean()
print("Average Number of Steps per Recipe:", round(avg_steps, 2), "\n")

# 11. Longest & Shortest Preparation Time
max_prep = recipes.loc[recipes["prepTimeMin"].idxmax()]
min_prep = recipes.loc[recipes["prepTimeMin"].idxmin()]

print("Longest Preparation Time:")
print(f"{max_prep['title']} – {max_prep['prepTimeMin']} minutes\n")

print("Shortest Preparation Time:")
print(f"{min_prep['title']} – {min_prep['prepTimeMin']} minutes\n")


