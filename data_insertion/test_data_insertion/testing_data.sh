curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Test Company 1", "lead": null }' \
localhost:3000/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Test Company 2", "lead": null }' \
localhost:3000/company

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Test Project 1" }' \
localhost:3000/project

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"name": "Test Project 2" }' \
localhost:3000/project

echo ""


curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_admin",  "name" : "Admin Admin", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 2}' \
localhost:3000/user

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_owner_1",  "name" : "Owner 1", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 1}' \
localhost:3000/user

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_owner_2",  "name" : "Owner 2", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 1}' \
localhost:3000/user

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_employee_1_1",  "name" : "Employee 1 1", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 0}' \
localhost:3000/user

echo ""


curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_employee_1_2",  "name" : "Employee 1 2", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 0}' \
localhost:3000/user

echo ""

curl \
--header "Content-type: application/json" \
--request POST \
--data '{"username": "test_employee_2_1",  "name" : "Employee 2 1", "email": "testemail", "password": "mypassword", "company_id": null, "accessType" : 0}' \
localhost:3000/user

echo ""

node data_insertion/test_data_insertion/test_companyid_setup.js

echo ""

node data_insertion/test_data_insertion/test_leadid_setup.js

echo ""
