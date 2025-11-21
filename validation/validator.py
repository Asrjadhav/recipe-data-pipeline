

import pandas as pd
import os
import re

OUTPUT_DIR = "output"
REPORT_PATH = os.path.join(OUTPUT_DIR, "validation_report.csv")

ALLOWED_DIFFICULTY = {"easy", "medium", "hard"}
ALLOWED_INTERACTION_TYPES = {"view", "like", "attempt", "rating"}
EMAIL_PATTERN = re.compile(r"[^@]+@[^@]+\.[^@]+")

# Add issue helper
def add_issue(issues, entity, record_id, msg):
    issues.append({
        "entity": entity,
        "id": record_id,
        "issue": msg
    })


def validate():
    print("🔍 Running Data Quality Validation...")

    issues = []

    # Load all CSV files
    try:
        recipes = pd.read_csv(os.path.join(OUTPUT_DIR, "recipe.csv"))
        ingredients = pd.read_csv(os.path.join(OUTPUT_DIR, "ingredients.csv"))
        steps = pd.read_csv(os.path.join(OUTPUT_DIR, "steps.csv"))
        users = pd.read_csv(os.path.join(OUTPUT_DIR, "users.csv"))
        interactions = pd.read_csv(os.path.join(OUTPUT_DIR, "interactions.csv"))
    except Exception as e:
        print("ERROR: Missing CSV files. Run transform.py again.")
        print(e)
        return

 
    # 1. VALIDATE RECIPES
    
    for _, r in recipes.iterrows():
        rid = r["recipeId"]

        # Required fields
        if pd.isna(r["title"]) or r["title"].strip() == "":
            add_issue(issues, "recipe", rid, "Title missing")

        if r["difficulty"].lower() not in ALLOWED_DIFFICULTY:
            add_issue(issues, "recipe", rid, f"Invalid difficulty '{r['difficulty']}'")

        # Positive numeric fields
        if r["prepTimeMin"] < 0:
            add_issue(issues, "recipe", rid, "prepTimeMin is negative")

        if r["cookTimeMin"] < 0:
            add_issue(issues, "recipe", rid, "cookTimeMin is negative")

        if r["servings"] <= 0:
            add_issue(issues, "recipe", rid, "servings must be positive")

        # Check ingredients present
        if not (ingredients["recipeId"] == rid).any():
            add_issue(issues, "recipe", rid, "No ingredients found")

        # Check steps present
        if not (steps["recipeId"] == rid).any():
            add_issue(issues, "recipe", rid, "No steps found")

    
    # 2. VALIDATE INGREDIENTS
    
    for _, ing in ingredients.iterrows():
        rid = ing["recipeId"]

        if pd.isna(ing["name"]) or ing["name"].strip() == "":
            add_issue(issues, "ingredient", rid, "Ingredient name missing")

        try:
            float(ing["quantity"])
        except:
            add_issue(issues, "ingredient", rid, f"Invalid quantity '{ing['quantity']}'")

    
    # 3. VALIDATE STEPS

    for _, step in steps.iterrows():
        rid = step["recipeId"]

        if pd.isna(step["text"]) or step["text"].strip() == "":
            add_issue(issues, "step", rid, "Step text missing")

    # 4. VALIDATE USERS
    
    for _, u in users.iterrows():
        uid = u["userId"]
        email = str(u["email"])

        if not EMAIL_PATTERN.match(email):
            add_issue(issues, "user", uid, f"Invalid email '{email}'")

    # 5. VALIDATE INTERACTIONS
    for _, it in interactions.iterrows():
        iid = it["interactionId"]

        # Valid type
        if it["type"].lower() not in ALLOWED_INTERACTION_TYPES:
            add_issue(issues, "interaction", iid, f"Invalid interaction type '{it['type']}'")

        # Rating range
        if it["type"] == "rating":
            try:
                r = float(it["rating"])
                if not (0 <= r <= 5):
                    add_issue(issues, "interaction", iid, f"Rating {r} out of range")
            except:
                add_issue(issues, "interaction", iid, f"Invalid rating '{it['rating']}'")

 
    # WRITE REPORT
    
    df = pd.DataFrame(issues)

    df.to_csv(REPORT_PATH, index=False)
    print(f"📄 Validation report written → {REPORT_PATH}")

    print(f"✔ Validation completed. Total issues: {len(df)}")


if __name__ == "__main__":
    validate()
