import re
import urllib.parse
import subprocess

# Load the fresh page HTML
data = open('/tmp/faa_full.html').read()

# Extract hidden fields
fields = {}
for name in ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION',
             '__EVENTTARGET', '__EVENTARGUMENT', '__VIEWSTATEENCRYPTED',
             '__LASTFOCUS', 'typAirmenInquiry']:
    m = re.search(r'name="' + re.escape(name) + r'"[^>]*value="([^"]*)"', data)
    if not m:
        # try alternate order
        m = re.search(r'value="([^"]*)"[^>]*name="' + re.escape(name) + r'"', data)
    if m:
        fields[name] = m.group(1)

# Build POST payload
post_fields = {
    '__LASTFOCUS': '',
    '__VIEWSTATE': fields.get('__VIEWSTATE', ''),
    '__VIEWSTATEGENERATOR': fields.get('__VIEWSTATEGENERATOR', ''),
    '__EVENTTARGET': '',
    '__EVENTARGUMENT': '',
    '__VIEWSTATEENCRYPTED': '',
    '__EVENTVALIDATION': fields.get('__EVENTVALIDATION', ''),
    'typAirmenInquiry': fields.get('typAirmenInquiry', '3487'),
    'ctl00$content$ctl01$txtbxLastName': 'Smith',
    'ctl00$content$ctl01$txtbxCertNo': '',
    'ctl00$content$ctl01$txtbxFirstName': '',
    'ctl00$content$ctl01$txtbxSearchBirthYear': '',
    'ctl00$content$ctl01$ddlSearchBirthMonth': '00',
    'ctl00$content$ctl01$ddlSearchBirthDay': '0',
    'ctl00$content$ctl01$txtbxCity': '',
    'ctl00$content$ctl01$ddlSearchState': '  ',
    'ctl00$content$ctl01$ddlSearchCountry': '',
    'ctl00$content$ctl01$txtParachuteSeal': '',
    'ctl00$content$ctl01$btnSearch': 'Search',
}

encoded = urllib.parse.urlencode(post_fields)

# Write POST data to temp file
with open('/tmp/faa_post_data.txt', 'w') as f:
    f.write(encoded)

print("POST data written. Key fields present:")
print(f"  __VIEWSTATE length: {len(fields.get('__VIEWSTATE',''))}")
print(f"  __EVENTVALIDATION length: {len(fields.get('__EVENTVALIDATION',''))}")
print(f"  __VIEWSTATEGENERATOR: {fields.get('__VIEWSTATEGENERATOR','')}")
print(f"  typAirmenInquiry: {fields.get('typAirmenInquiry','')}")
