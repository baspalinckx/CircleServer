API endpoints:

POST /user/login

required body: {
  "email": email
  "password": password
  "transparent": true/false (true for android app, false for angular site)
}

response: {
  "status": true/false
  "result": token / error
}
