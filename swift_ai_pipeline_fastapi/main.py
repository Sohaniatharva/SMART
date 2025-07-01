
import os
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import io, json, pandas as pd, tempfile, asyncio
from utils import sr_ai_parser, mt_parser, ai_comparator
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="SR2024 AI Pipeline")

class CompareRequest(BaseModel):
    mt_message: str
    rules: List[Dict[str, Any]]

@app.post("/parse-rules")
async def parse_rules(pdf: UploadFile = File(...), mt_list: List[str] = Query(...)):
    pdf_bytes = await pdf.read()
    rules = await sr_ai_parser.extract_changes_from_pdf(pdf_bytes, mt_list)
    return {"rules": rules, "count": len(rules)}

@app.get("/parse-rules-from-year")
async def parse_rules_from_year(year: int = Query(...), mt_list: List[str] = Query(...)):
    filename = f"SR{year}.pdf"
    filepath = os.path.join("resources", filename)  # assumes file is in resources dir

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"{filename} not found")

    # Just pass the string path
    rules = await sr_ai_parser.extract_changes_from_pdf(filepath, mt_list)
    return {"rules": rules, "count": len(rules)}
    #return rules

@app.get("/compare")
async def compare(mt_msg: str = Query(..., description="Paste full MT message including all tags")):
    fields, mt_type = mt_parser.parse_mt_message(mt_msg)
    # diffs = await ai_comparator.compare(fields, req.rules)
    #return {"message_type": mt_type, "diffs": diffs}
    return {"message_type": mt_type, "fields": fields}
