import csv

# ...existing code...

async def extract_changes_from_file(input_file_path: str, output_csv_path: str):
    # Read the SR2024 file content
    with open(input_file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Call the async extraction function
    changes = await extract_changes_from_text(text)

    # If there's an error, save it as a single-row CSV
    if isinstance(changes, list) and "error" in changes[0]:
        with open(output_csv_path, "w", newline='', encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["error"])
            writer.writerow([changes[0]["error"]])
        return

    # Write the JSON list to CSV
    if isinstance(changes, list) and len(changes) > 0:
        keys = changes[0].keys()
        with open(output_csv_path, "w", newline='', encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=keys)
            writer.writeheader()
            writer.writerows(changes)