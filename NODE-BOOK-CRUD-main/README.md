BOOK-CRUD
CRUD Application in Express JS


Getting Started

cd backend

npm install

pm2 start or node index

CURL REQUEST
Admin Panel 
ADD BOOK : curl --location --request POST 'http://localhost:1233/admin/add-book'
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "title":"Big Lion", "author":"David", "summary":"This is Crud App" }'

LIST BOOK :

curl --location --request POST 'http://localhost:1233/admin/list-book'
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "page":4, "pageSize":2 }'

GET SINGLE BOOK :

curl --location --request POST 'http://localhost:1233/admin/get-single-book'
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a" }'

UPDATE BOOK :

curl --location --request POST 'http://localhost:1233/admin/update-book'
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a", "title": "new 111", "author": "smith", "summary": "This is Crud App 1" }'

Delete Book

curl --location --request POST 'http://localhost:1233/admin/delete-book'
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a"

}'



USER PANEL : 


LIST BOOK :

curl --location --request POST 'http://localhost:1233/user/list-book' --AUTH Required --header 
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "page":4, "pageSize":2 }'

GET SINGLE BOOK :

curl --location --request POST 'http://localhost:1233/user/get-single-book' --AUTH Required --header 
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a" }'

COLLECT BOOK :

curl --location --request POST 'http://localhost:1233/user/collect-book' --AUTH Required --header 
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a"}'

LIST BOOK :

curl --location --request POST 'http://localhost:1233/user/my-book'  --AUTH Required --header 
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "page":4, "pageSize":2 }'

COLLECT BOOK :

curl --location --request POST 'http://localhost:1233/user/submit-book' --AUTH Required --header 
--header 'origin: http://localhost:3000'
--header 'Content-Type: application/json'
--data-raw '{ "_id":"654d2bdd4dea021c55f3750a"}'
