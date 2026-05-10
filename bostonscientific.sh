# curl 'https://bostonscientific.eightfold.ai/api/pcsx/similar_positions?domain=bostonscientific.com&position_id=563602811781067' \
#  --compressed \
# -H 'Accept: application/json, text/plain, */*' \
# -H 'Accept-Encoding: gzip, deflate, br, zstd' \
# -H 'Connection: keep-alive'

curl 'https://bostonscientific.eightfold.ai/api/pcsx/search?domain=bostonscientific.com&query=Clinical%20Specialist%20CRM&location=United%20States&start=0&sort_by=relevance&filter_include_remote=1' \
  --compressed \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'Connection: keep-alive'
