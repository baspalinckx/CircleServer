API endpoints:

POST /user/rsalogin

required body: {
  "email": email
  "signature": signature (singature van de hash van de email geencrypt met je private key)
  "transparent": true/false (true for android app, false for angular site)
}

response: {
  "status": true/false
  "result": error / {
        "streamingurl": streamingURL
  }
}
