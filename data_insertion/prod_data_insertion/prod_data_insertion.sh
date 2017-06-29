url="http://gravitytimesheet.herokuapp.com"

echo "\nInserting Projecdts"

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "IFRS9"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "CCAR Data Risk - Finance"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "CCAR Data Risk - Risk"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "Y14M&Q Efficiencies"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "FR 2052a"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "Transportation Finance Data - Finance"}' \
$url/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name" : "Transportation Finance Data - Risk"}' \
$url/project


echo "\nInserting Companies"

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Gravity Associates Inc", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Optimus Consulting Inc", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Meraki Inc", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Traverse Consulting Inc", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Defy Advanced Corp", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "RFC Consulting Inc", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "William Kragh", "lead": null }' \
$url/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Carolyn Kragh", "lead": null }' \
$url/company

echo "\nInserting Users"

node data_insertion/prod_data_insertion/user_creation.js

echo "\nUpdating Lead Ids"

node data_insertion/prod_data_insertion/company_lead_update.js

echo ""






