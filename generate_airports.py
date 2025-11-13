import csv
import json

# Country name mappings from CSV to standard names
country_name_map = {
    'Bolivia, Plurinational State of': 'Bolivia',
    'Bonaire, Sint Eustatius and Saba': 'Bonaire, Sint Eustatius and Saba',
    'Brunei Darussalam': 'Brunei',
    'Congo, Democratic Republic of the': 'Democratic Republic of the Congo',
    'Czechia': 'Czech Republic',
    "Côte d'Ivoire": "Ivory Coast",
    'Falkland Islands': 'Falkland Islands',
    'Iran, Islamic Republic of': 'Iran',
    'Korea, Democratic People\'s Republic of': 'North Korea',
    'Korea, Republic of': 'South Korea',
    'Lao People\'s Democratic Republic': 'Laos',
    'Micronesia, Federated States of': 'Micronesia',
    'Netherlands, Kingdom of the': 'Netherlands',
    'Taiwan, Province of China': 'Taiwan',
    'Tanzania, United Republic of': 'Tanzania',
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
    'United States of America': 'United States',
    'Venezuela, Bolivarian Republic of': 'Venezuela',
    'Viet Nam': 'Vietnam',
    'Virgin Islands (British)': 'British Virgin Islands',
    'Virgin Islands (U.S.)': 'U.S. Virgin Islands',
    'Türkiye': 'Turkey',
    'Russian Federation': 'Russia'
}

# Read the CSV file
airports_by_country = {}

with open('dist/assets/filtered_airports.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        country = row['country_name']
        airport = row['airport_name']
        
        # Normalize country name
        country = country_name_map.get(country, country)
        
        if country not in airports_by_country:
            airports_by_country[country] = []
        
        airports_by_country[country].append(airport)

# Generate TypeScript file
output = "// Complete airport database for all countries from CSV data\n"
output += "export const COUNTRY_AIRPORTS: Record<string, string[]> = {\n"

for i, (country, airports) in enumerate(sorted(airports_by_country.items())):
    # Escape single quotes in country names and airport names
    country_escaped = country.replace("'", "\\'")
    airports_escaped = [f"'{airport.replace(chr(39), chr(92) + chr(39))}'" for airport in airports]
    
    airports_str = ", ".join(airports_escaped)
    comma = "," if i < len(airports_by_country) - 1 else ""
    
    output += f"  '{country_escaped}': [{airports_str}]{comma}\n"

output += "};\n"

# Write to airports.ts
with open('src/data/airports.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"✅ Generated airports.ts with {len(airports_by_country)} countries and {sum(len(a) for a in airports_by_country.values())} airports!")
