

export const Response2 ={
  "data": {
    "msgType": "MT103",
    "srYear": "SR2025",
    "fields": [
      {
        "field": "20",
        "current_Line": ":20:SR24REF123456789",
        "expected_Line_example": ":20:SR24REF123456789",
        "requirementType": "None",
        "Change_Description": "No",
        "hasChanged": false
      },
      {
        "field": "23B",
        "current_Line": ":23B:CRED",
        "expected_Line_example": ":23B:CRED",
        "requirementType": "None",
        "Change_Description": "No",
        "hasChanged": false
      },
      {
        "field": "32A",
        "current_Line": ":32A:240626USD15000,",
        "expected_Line_example": ":32A:240626USD15000,",
        "requirementType": "None",
        "Change_Description": "No",
        "hasChanged": false
      },
      {
        "field": "33B",
        "current_Line": ":33B:USD15000,",
        "expected_Line_example": ":33B:USD15000,",
        "requirementType": "None",
        "Change_Description": "No",
        "hasChanged": false
      },
      {
        "field": "50K",
        "current_Line": ":50K:/0011223344\nJOHN DOE",
        "expected_Line_example": ":50K:/0011223344\nJOHN DOE\n123 MAIN ST\nNEW YORK",
        "requirementType": "Mandatory",
        "Change_Description": "Ordering customer must include full name and address",
        "hasChanged": true
      },
      {
        "field": "59",
        "current_Line": ":59:/1234567890\nJANE SMITH",
        "expected_Line_example": ":59:/DE09876543211234567890\nJANE SMITH",
        "requirementType": "Mandatory",
        "Change_Description": "IBAN format required instead of basic account number",
        "hasChanged": true
      },
      {
        "field": "70",
        "current_Line": ":70:PAYMENT FOR INVOICE 789",
        "expected_Line_example": ":70:/INV/789\n/REF/PO12345",
        "requirementType": "Optional",
        "Change_Description": "Structured remittance format recommended",
        "hasChanged": true
      },
      {
        "field": "71A",
        "current_Line": ":71A:SHA",
        "expected_Line_example": ":71A:BEN",
        "requirementType": "Mandatory",
        "Change_Description": "`SHA` is no longer allowed; use `BEN` or `OUR`",
        "hasChanged": true
      }
    ]
  }
}

