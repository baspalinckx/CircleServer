API endpoints:

POST /user/salt

required body: {
    "email": email
}

response: {
    "status": true/false,
    "result": {
        "salt": salt
    }
}

POST /user/login

required body: {
  "email": email
  "hash": sha256Hash(salt+password)
  "transparent": true/false (true for android app, false for angular site)
}

response: {
  "status": true/false
  "result": error / {
    "token": token,
    "user": {
      "email": email,
      "firstname": firstname,
      "lastname": lastname
    }
  }
}
