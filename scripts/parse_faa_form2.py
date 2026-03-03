import re

data = open('/home/stephen-johns/.claude/projects/-home-stephen-johns-github-iwanttobeapilot/cd753123-fe5d-4731-af50-5211d9f0ab36/tool-results/b3ac028.txt').read()

print(f"Total HTML length: {len(data)} chars")

# Search for key field names
for keyword in ['txtLastName', 'txtFirstName', 'ddlState', 'ddlCert', 'ddlRating', 
                'ddlMedical', 'btnSearch', 'SearchButton', 'LastName', 'FirstName',
                'CertType', 'RatingType', 'submit', 'Select', 'State']:
    positions = [m.start() for m in re.finditer(keyword, data, re.IGNORECASE)]
    if positions:
        print(f"\nKeyword '{keyword}' found at positions: {positions[:5]}")
        # Show context around first match
        pos = positions[0]
        snippet = data[max(0,pos-50):pos+150]
        print(f"  Context: {repr(snippet[:200])}")
