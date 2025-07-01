import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_parse_rules_from_year():
    response = client.get(
        "/parse-rules-from-year",
        params={"year": 2024, "mt_list": ["306"]}
    )

    print("Status Code:", response.status_code)
    print("Extracted changes (preview):", json.dumps(response.json(), indent=2))

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "rules" in data
    assert isinstance(data["rules"], list)
    assert "count" in data
    assert isinstance(data["count"], int)
