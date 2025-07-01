from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@patch("utils.ai_comparator.client.chat.completions.create", new_callable=AsyncMock)
def test_compare_endpoint(mock_create):
    mock_create.return_value = AsyncMock()
    mock_create.return_value.choices = [
        type("C", (), {
            "message": type("M", (), {
                "content": '[{"field":"12D","current_value":"missing","sr2024_requirement":"mandatory","is_compliant":false,"suggestion":"add 12D"}]'
            })()
        })()
    ]

    sample_rules = [{"mt_type":"306","field":"12D","change_description":"mandatory","cr_id":"","impact":"2+"}]
    sample_msg   = "{1:F01AAAA...}{2:I306BBBB...}{4:\\n:20:ABC\\n-}"

    resp = client.post("/compare", json={"mt_message": sample_msg, "rules": sample_rules})
    print("Response JSON:", resp.json())

    assert resp.status_code == 200
    assert resp.json()["diffs"][0]["field"] == "12D"
