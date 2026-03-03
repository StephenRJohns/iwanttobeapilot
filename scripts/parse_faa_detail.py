import re

data = open('/tmp/faa_detail.html').read()

print(f"Detail page size: {len(data)} chars")

# Look for airman detail section
for marker in ['Certificate Information', 'Medical Information', 'Airmen Detail',
               'divAirmanDetail', 'First Name', 'Last Name', 'City', 'State',
               'Certificate Type', 'Rating', 'Class']:
    idx = data.find(marker)
    if idx >= 0:
        snippet = data[idx:idx+300]
        clean = re.sub(r'<[^>]+>', ' ', snippet)
        clean = re.sub(r'\s+', ' ', clean).strip()
        print(f"\nFound '{marker}' at {idx}:")
        print(f"  {clean[:200]}")

# Find all table cells with data
print("\n=== DATA TABLE CELLS ===")
# Look for the certificate/rating data tables
cert_section = data.find('Certificate Information')
if cert_section > 0:
    section = data[cert_section:cert_section+5000]
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', section, re.DOTALL | re.IGNORECASE)
    for row in rows[:30]:
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL | re.IGNORECASE)
        cell_texts = []
        for c in cells:
            t = re.sub(r'<[^>]+>', ' ', c)
            t = re.sub(r'\s+', ' ', t).strip()
            if t:
                cell_texts.append(t)
        if cell_texts:
            print('  | '.join(cell_texts[:6]))
