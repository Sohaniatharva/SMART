
import re
from typing import Dict, Tuple

# def parse_mt_message(msg: str) -> Tuple[Dict[str,str], str]:
#     """Very light parser: returns (fields dict, MT type)"""
#     mt = re.search(r"{2:I(\d{3})", msg)
#     mt_type = mt.group(1) if mt else "000"
#     content_match = re.search(r"{4:(.*?)-}", msg, re.S)
#     block = content_match.group(1) if content_match else ""
#     fields={}
#     for line in block.splitlines():
#         if line.startswith(":"):
#             tag, val = line[1:].split(":",1)
#             fields[tag]=val.strip()
#     return fields, mt_type

def parse_mt_message(mt_message: str):
    mt_type_match = re.search(r"{2:I(\d{3})", mt_message)
    mt_type = mt_type_match.group(1) if mt_type_match else "Unknown"

    block_4_match = re.search(r"{4:(.*?)-}", mt_message, re.DOTALL)
    block_4_content = block_4_match.group(1).strip() if block_4_match else ""

    # Split fields like :20:Value
    field_pattern = re.compile(r":([0-9A-Z]{2,4}):([^\n:]*)")
    fields = {match.group(1): match.group(2).strip() for match in field_pattern.finditer(block_4_content)}

    return fields, mt_type
