import re

data = open('/tmp/faa_detail.html').read()

# Print substantial portion of the airman detail section
# Medical and cert info seems to be around 87000-96000
section = data[83000:98000]
clean = re.sub(r'<script[^>]*>.*?</script>', '', section, flags=re.DOTALL | re.IGNORECASE)
clean = re.sub(r'<style[^>]*>.*?</style>', '', clean, flags=re.DOTALL | re.IGNORECASE)
clean = re.sub(r'<[^>]+>', ' ', clean)
clean = re.sub(r'&nbsp;', ' ', clean)
clean = re.sub(r'&amp;', '&', clean)
clean = re.sub(r'\s+', ' ', clean).strip()
print(clean[:5000])
