
import os

file_path = r"c:\Users\setortecnico1\Downloads\thermas parks\thermas-dos-laranjais.html"

with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Replacements based on observed corruption
replacements = {
    "atraes": "atrações",
    "guas": "águas",
    "est": "está",
    "Estncia": "Estância",
    "Turstica": "Turística",
    "Olmpia": "Olímpia",
    "quilmetros": "quilômetros",
    " o parque": "É o parque",
    "aqutico": "aquático",
    "so": "são",
    "toboguas": "toboáguas",
    "at": "até",
    "180": "180º",
    "alm": "além",
    "zoolgico": "zoológico",
    "Atraes": "Atrações",
    "rea": "área",
    " abastecido": "é abastecido",
    "Aqufero": "Aquífero",
    "Localizao": "Localização",
    "Jussara/Gois": "Jussara/Goiás",
    "Guarany": "Guarani", # Check if this is needed
    "": "é" # Fallback for standalone 'é' if context matches, but be careful
}

# Apply specific longer replacements first
ordered_keys = sorted(replacements.keys(), key=len, reverse=True)

for key in ordered_keys:
    if key in content:
        print(f"Replacing {key} with {replacements[key]}")
        content = content.replace(key, replacements[key])

# Specific context fixes if above didn't catch everything
content = content.replace(" ", "é ") 
content = content.replace(" ", " é")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done.")
