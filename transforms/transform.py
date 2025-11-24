import json
import pandas as pd
import os

# Ensure output folder exists
if not os.path.exists("output"):
    os.makedirs("output")

print(" Loading exported JSON files...")

# Load JSON exports 
recipes = json.load(open("exports/recipes.json"))
users = json.load(open("exports/users.json"))
interactions = json.load(open("exports/interactions.json"))

print("JSON files loaded")


# 1) RECIPE TABLE

recipe_rows = []
ingredient_rows = []
step_rows = []

for r in recipes:
    recipe_rows.append({
        "recipeId": r["id"],
        "title": r.get("title", ""),
        "authorId": r.get("authorId", ""),
        "description": r.get("description", ""),
        "prepTimeMin": r.get("prepTimeMin", 0),
        "cookTimeMin": r.get("cookTimeMin", 0),
        "difficulty": r.get("difficulty", ""),
        "servings": r.get("servings", 0),
        "tags": ",".join(r.get("tags", [])),
        "createdAt": r.get("createdAt", "")
    })

    # INGREDIENTS TABLE
    ingredients = r.get("ingredients", [])
    for i, ing in enumerate(ingredients):
        ingredient_rows.append({
            "recipeId": r["id"],
            "ingredientNo": i + 1,
            "name": ing.get("name", ""),
            "quantity": ing.get("quantity", ""),
            "unit": ing.get("unit", "")
        })

    # STEPS TABLE
    steps = r.get("steps", [])
    for s in steps:
        step_rows.append({
            "recipeId": r["id"],
            "stepNo": s.get("stepNo", ""),
            "text": s.get("text", ""),
            "imagePath": s.get("imagePath", "")
        })

# Save CSVs
pd.DataFrame(recipe_rows).to_csv("output/recipe.csv", index=False)
pd.DataFrame(ingredient_rows).to_csv("output/ingredients.csv", index=False)
pd.DataFrame(step_rows).to_csv("output/steps.csv", index=False)

print("Recipe, Ingredients, Steps CSV created")


# 2) USERS TABLE

user_rows = []
for u in users:
    user_rows.append({
        "userId": u["id"],
        "name": u.get("name", ""),
        "email": u.get("email", ""),
        "joinedAt": u.get("joinedAt", ""),
        "profilePic": u.get("profilePic", "")
    })

pd.DataFrame(user_rows).to_csv("output/users.csv", index=False)
print("Users CSV created")


# 3) INTERACTIONS TABLE

interaction_rows = []
for inter in interactions:
    interaction_rows.append({
        "interactionId": inter["id"],
        "recipeId": inter.get("recipeId", ""),
        "userId": inter.get("userId", ""),
        "type": inter.get("type", ""),
        "rating": inter.get("rating", ""),
        "difficultyReported": inter.get("difficultyReported", ""),
        "createdAt": inter.get("createdAt", "")
    })

pd.DataFrame(interaction_rows).to_csv("output/interactions.csv", index=False)
print("Interactions CSV created")

print("\n Transformation complete! Check the 'output' folder.")
