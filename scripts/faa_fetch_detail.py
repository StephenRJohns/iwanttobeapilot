import re
import urllib.parse
import subprocess

# Load the search results page (which has a fresh ViewState post-search)
data = open('/tmp/faa_results3.html').read()

# Extract updated hidden fields from the results page
fields = {}
for name in ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION',
             '__EVENTTARGET', '__EVENTARGUMENT', '__VIEWSTATEENCRYPTED',
             '__LASTFOCUS', 'typAirmenInquiry']:
    m = re.search(r'name="' + re.escape(name) + r'"[^>]*value="([^"]*)"', data)
    if m:
        fields[name] = m.group(1)
    else:
        # try alternate attribute order
        m = re.search(r'id="' + re.escape(name) + r'"[^>]*value="([^"]*)"', data)
        if m:
            fields[name] = m.group(1)

print("Hidden fields found:")
for k, v in fields.items():
    print(f"  {k}: {len(v)} chars" if len(v) > 30 else f"  {k}: {repr(v)}")

# Simulate clicking on ctl01 (first result: JOHN SMITH SR)
# __doPostBack('ctl00$content$ctl01$drAirmenList$ctl01$lnkbtnAirmenName','')
event_target = 'ctl00$content$ctl01$drAirmenList$ctl01$lnkbtnAirmenName'
event_argument = ''

post_fields = {
    '__LASTFOCUS': '',
    '__VIEWSTATE': fields.get('__VIEWSTATE', ''),
    '__VIEWSTATEGENERATOR': fields.get('__VIEWSTATEGENERATOR', ''),
    '__EVENTTARGET': event_target,
    '__EVENTARGUMENT': event_argument,
    '__VIEWSTATEENCRYPTED': '',
    '__EVENTVALIDATION': fields.get('__EVENTVALIDATION', ''),
    'typAirmenInquiry': fields.get('typAirmenInquiry', '3487'),
    'ctl00$content$ctl01$txtbxLastName': 'Smith',
    'ctl00$content$ctl01$txtbxCertNo': '',
    'ctl00$content$ctl01$txtbxFirstName': 'John',
    'ctl00$content$ctl01$txtbxSearchBirthYear': '',
    'ctl00$content$ctl01$ddlSearchBirthMonth': '00',
    'ctl00$content$ctl01$ddlSearchBirthDay': '0',
    'ctl00$content$ctl01$txtbxCity': '',
    'ctl00$content$ctl01$ddlSearchState': 'TX',
    'ctl00$content$ctl01$ddlSearchCountry': 'USA',
    'ctl00$content$ctl01$txtParachuteSeal': '',
}

with open('/tmp/faa_post_detail.txt', 'w') as f:
    f.write(urllib.parse.urlencode(post_fields))
print("\nPOST data for detail click written to /tmp/faa_post_detail.txt")
