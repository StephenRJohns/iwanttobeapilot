import re

data = open('/tmp/faa_results3.html').read()

# Find the results table with actual data
results_start = data.find('Total names found')
if results_start > 0:
    section = data[results_start-500:results_start+8000]
    
    # Find all anchor tags (airman name links)
    links = re.findall(r'<a[^>]+href="([^"]+)"[^>]*>([^<]+)</a>', section, re.IGNORECASE)
    print('=== LINKS/ANCHORS IN RESULTS ===')
    for href, text in links[:20]:
        print(f'  href={repr(href)} text={repr(text.strip())}')
    
    print()
    # Find table rows
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', section, re.IGNORECASE | re.DOTALL)
    print(f'Table rows found: {len(rows)}')
    for i, row in enumerate(rows[:10]):
        clean = re.sub(r'<[^>]+>', ' ', row)
        clean = re.sub(r'\s+', ' ', clean).strip()
        if clean:
            print(f'  Row {i}: {clean[:200]}')

print()
print('=== TOTAL RECORD COUNT ===')
totals_m = re.search(r'Total names found is (\d+)', data)
if totals_m:
    print(f'Total: {totals_m.group(1)}')
