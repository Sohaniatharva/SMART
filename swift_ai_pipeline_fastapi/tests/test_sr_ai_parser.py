import os
import pytest
import json
from utils import sr_ai_parser

PDF_PATH = "resources/SR2024.pdf"  
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

@pytest.mark.skipif(
    not OPENAI_KEY or not PDF_PATH or not os.path.isfile(PDF_PATH),
    reason="Requires OPENAI_API_KEY and SR2024_PDF_PATH env vars pointing to a real PDF."
)
@pytest.mark.asyncio
async def test_extract_changes_from_pdf_real():
    """
    This test calls OpenAI for real. It can consume tokens.
    Make sure your account has quota.
    """
    changes = await sr_ai_parser.extract_changes_from_pdf(PDF_PATH)

    # Basic sanity checks
    assert isinstance(changes, list), "Output should be a list"
    assert len(changes) > 0, "Should extract at least one change"
    first = changes[0]

    required_keys = {"mt_type", "field", "change_description", "cr_id", "impact"}
    assert required_keys.issubset(first.keys()), f"Missing keys in first item: {first}"

    # Save to CSV in a temp file and validate it exists
    # csv_file = "sr2024_changes_real.csv"
    # out_path = sr_ai_parser.save_changes_to_csv(changes, csv_file)
    # assert os.path.isfile(out_path), "CSV file was not written"

    # Log a preview for debugging
    print("Extracted changes (preview):", json.dumps(changes, indent=2))
    #print(f"CSV written to: {out_path}")
