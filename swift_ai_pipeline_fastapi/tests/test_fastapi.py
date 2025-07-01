import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_compare_endpoint():
    sample_rules = [
        {
            "mt_type": "306",
            "field": "12D",
            "change_description": "mandatory",
            "cr_id": "CR001",
            "impact": "2+"
        },
        {
            "mt_type": "306",
            "field": "30T",
            "change_description": "must be in YYMMDD format",
            "cr_id": "CR002",
            "impact": "1"
        },
        {
            "mt_type": "306",
            "field": "57A",
            "change_description": "mandatory field for account servicing institution",
            "cr_id": "CR003",
            "impact": "2+"
        }
    ]


    sample_msg = (
    "{1:F01BANKBEBBAXXX0000000000}"
    "{2:I306BANKUS33XXXXN}"
    "{4:\n"
    ":20:TRN12345678\n"
    ":12D:USDINR\n"
    ":30T:2024/06/27\n"  # Incorrect format; should be YYMMDD like 240627
    # Missing :57A:
    "-}"
)


    resp = client.post("/compare", json={"mt_message": sample_msg, "rules": sample_rules})
    print("Response JSON:", json.dumps(resp.json()["diffs"], indent=4))
    #print("Response JSON:", resp.choices[0].message.content)
    print("Status Code:", resp.status_code)

    assert resp.status_code == 200
    assert "diffs" in resp.json()
