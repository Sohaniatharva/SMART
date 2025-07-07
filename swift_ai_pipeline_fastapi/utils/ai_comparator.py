import re
from openai import AsyncOpenAI, APITimeoutError, RateLimitError, AuthenticationError, APIError
import os, json
from typing import Dict, List, Any
from dotenv import load_dotenv
load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

_PROMPT = (
    "You are a SWIFT SR2024-compliance engine.\n\n"
    "TASK:\n"
    "Compare the SWIFT message fields with the SR2024 rules and return a pure JSON list.\n"
    "Each item must have exactly these keys (in order):\n"
    "  - field (string)\n"
    "  - current_value (string, or 'missing')\n"
    "  - expected_Line_example (string: a realistic and specific example of the correct value, not a generic format)\n"
    "  - sr2024_requirement (string)\n"
    "  - is_compliant (true/false)\n"
    "  - suggestion (string: explain exactly what change is needed. If compliant, say 'No change needed')\n\n"
    "STRICT OUTPUT FORMAT:\n"
    "- Return ONLY a JSON list.\n"
    "- Do NOT use markdown, triple backticks, or commentary.\n\n"
    "Rules JSON:\n{rules}\n\n"
    "Message Fields JSON:\n{fields}\n"
)

async def compare(fields: Dict[str, str], rules: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    present_fields = set(fields.keys())
    filtered_rules = [rule for rule in rules if rule["field"] in present_fields]
    print("Filtered rules:", filtered_rules)

    if not filtered_rules:
        return [{"info": "no_applicable_rules", "details": "No rules matched the message fields"}]

    text = _PROMPT.format(rules=json.dumps(filtered_rules), fields=json.dumps(fields))

    try:
        resp = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a SWIFT compliance assistant."},
                {"role": "user", "content": text}
            ],
            temperature=0.3,
            max_tokens=3000,
        )
        print("Response JSON:", resp.json())
        content = resp.choices[0].message.content
        if content is None:
            return [{"error": "no_content", "details": "No content returned from OpenAI API."}]
        raw = content.strip()
        # # Remove triple backticks if present
        cleaned = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
        print("Cleaned response:", cleaned)
        return json.loads(cleaned)

    # ——— Catch common OpenAI errors ——— #
    except RateLimitError as e:
        return [{"error": "rate_limit", "details": str(e)}]

    except AuthenticationError as e:
        return [{"error": "auth_error", "details": str(e)}]

    except APIError as e:
        return [{"error": "api_error", "details": str(e)}]

    except Exception as e:
        # Generic safeguard
        return [{"error": "unknown", "details": str(e)}]