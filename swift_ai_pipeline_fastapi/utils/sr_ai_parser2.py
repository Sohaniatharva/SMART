# utils/sr_ai_parser.py

import os
import json
import csv
import re
from typing import List, Dict
from dotenv import load_dotenv
import fitz  # PyMuPDF
from openai import AsyncOpenAI
from utils.db import collection  

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

_PROMPT_TEMPLATE = (
    "You are a SWIFT SR2024 documentation analyst.\n\n"
    "TASK:\n"
    "From the SR2024 release notes, extract only the changes that relate to the specified MT message types.\n"
    "Ignore all unrelated changes.\n"
    "For each relevant change, return an item in a pure JSON list with the following exact keys and order:\n"
    "- mt_type (string): Only numeric MT type (e.g., '306')\n"
    "- field (string): Only the field tag (e.g., '22U'). If multiple fields are mentioned, return one item per field.\n"
    "- change_description (string): A short, focused description of the specific change (e.g., 'Deleted code ACLA')\n"
    "- cr_id (string): Change Request ID if available, otherwise an empty string\n"
    "- impact (string): One of 'Low', 'Medium', or 'High'\n\n"
    "ONLY return changes where mt_type is in this list: {mt_list}\n\n"
    "STRICT OUTPUT FORMAT:\n"
    "- Return ONLY a JSON list (no commentary, no markdown)\n"
    "- Keep descriptions concise and meaningful\n\n"
    "Release Notes:\n\"\"\"\n{text}\n\"\"\""
)

def extract_text_from_pdf(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    return "\n".join(page.get_text() for page in doc.pages())

async def extract_changes_from_pdf(pdf_path: str, mt_list: List[str]) -> List[Dict]:
    text = extract_text_from_pdf(pdf_path)
    all_changes = []

    for mt_type in mt_list:
        # Check cache
        cached = get_cached_rules(mt_type)
        if cached:
            print(f"Using cached rules for MT{mt_type}")
            all_changes.extend(cached)
            continue

        # Not in cache, run OpenAI
        prompt = _PROMPT_TEMPLATE.format(text=text, mt_list=mt_type)

        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert in SWIFT message compliance."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            content = response.choices[0].message.content or ""
            cleaned = re.sub(r"^```(?:json)?|```$", "", content.strip(), flags=re.MULTILINE).strip()
            parsed = json.loads(cleaned)

            if isinstance(parsed, list):
                cache_rules(mt_type, parsed)
                all_changes.extend(parsed)
            else:
                error_entry = {"mt_type": mt_type, "error": "Unexpected format in response"}
                all_changes.append(error_entry)
        except Exception as e:
            all_changes.append({"mt_type": mt_type, "error": str(e)})

    return all_changes

def get_cached_rules(mt_type: str) -> List[Dict]:
    result = collection.find_one({"mt_type": mt_type})
    if result and "rules" in result:
        return result["rules"]
    return []


def cache_rules(mt_type: str, rules: List[Dict]) -> None:
    collection.update_one(
        {"mt_type": mt_type},
        {"$set": {"rules": rules}},
        upsert=True
    )

def save_changes_to_csv(changes: List[Dict], filename: str = "sr2024_changes.csv") -> str:
    keys = ["mt_type", "field", "change_description", "cr_id", "impact"]
    with open(filename, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in changes:
            writer.writerow({key: row.get(key, "") for key in keys})
    return filename
