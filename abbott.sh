curl 'https://www.jobs.abbott/widgets' \
  --compressed \
  -X POST \
  -H 'content-type: application/json' \
  --data-raw '{"lang":"en_us","deviceType":"desktop","country":"us","pageName":"home","ddoKey":"globalSearchEventV3","location_size":50,"category_size":50,"job_size":50,"keywords":"Clinical Specialist CRM","category":"category","location":"location"}'

