import re

data = open('/home/stephen-johns/.claude/projects/-home-stephen-johns-github-iwanttobeapilot/cd753123-fe5d-4731-af50-5211d9f0ab36/tool-results/b3ac028.txt').read()

print("=== ALL INPUTS ===")
inputs = re.findall(r'<input[^>]+>', data, re.IGNORECASE)
for inp in inputs:
    print(inp[:300])

print("\n=== ALL SELECTS ===")
selects = re.findall(r'<select[^>]+>', data, re.IGNORECASE)
for s in selects:
    print(s[:300])

print("\n=== SELECT OPTIONS (first few per select) ===")
# Get each select block with its options
select_blocks = re.findall(r'<select[^>]+>.*?</select>', data, re.IGNORECASE | re.DOTALL)
for block in select_blocks:
    sel_tag = re.search(r'<select[^>]+>', block).group()
    sel_id = re.search(r'id="([^"]+)"', sel_tag)
    sel_name = re.search(r'name="([^"]+)"', sel_tag)
    print(f"\nSELECT id={sel_id.group(1) if sel_id else '?'} name={sel_name.group(1) if sel_name else '?'}")
    options = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>', block)
    for val, label in options[:10]:
        print(f"  value='{val}' label='{label.strip()}'")
    if len(options) > 10:
        print(f"  ... ({len(options)} total options)")

print("\n=== FORM ACTION ===")
forms = re.findall(r'<form[^>]+>', data, re.IGNORECASE)
for f in forms:
    print(f)
