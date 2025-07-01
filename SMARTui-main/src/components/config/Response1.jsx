export const Response1 = {
  "data": [
    {
      "messageType": "MT103",
      "hasChanges": true,
      "changes": [
        {
          "field": "22U",
          "current_value": "ABCD1234",
          "requirementType": "Mandatory",
          "requirement": "Field 22U must be extended to 12 characters as per ISO 4914",
          "suggestion": "Update field 22U to be exactly 12 characters long (e.g., ABCD12345678)"
        },
        {
          "field": "12D",
          "current_value": "missing",
          "requirementType": "Mandatory",
          "requirement": "Required for certain option types",
          "suggestion": "Add field 12D with an appropriate date if this is an option trade"
        },
        {
          "field": "29E",
          "current_value": "missing",
          "requirementType": "Optional",
          "requirement": "Allowed EMTA code for expiration/valuation",
          "suggestion": "Optional: Add EMTA code in field 29E if applicable"
        }
      ]
    },
    {
      "messageType": "MT304",
      "hasChanges": false,
      "changes": []
    },
    {
      "messageType": "MT305",
      "hasChanges": true,
      "changes": [
        {
          "field": "22U",
          "current_value": "ABCD1234",
          "requirementType": "Mandatory",
          "requirement": "Field 22U must be extended to 12 characters as per ISO 4914",
          "suggestion": "Update field 22U to be exactly 12 characters long (e.g., ABCD12345678)"
        }
      ]
    },
    {
      "messageType": "MT307",
      "hasChanges": false,
      "changes": []
    }
  ]
}
