HTTP/1.1 200 OK
Content-Type: application/json

{
  "fieldsets": [
    {
      "fields": [
        "fullname",
        "email"
      ],
      "id": "default",
      "title": "Default"
    }
  ],
  "properties": {
    "email": {
      "description": "We will use this address if you need to recover your password",
      "title": "Email",
      "type": "string",
      "widget": "email"
    },
    "fullname": {
      "description": "Enter full name, for example, John Smith.",
      "title": "Full Name",
      "type": "string"
    }
  },
  "required": [
    "email"
  ]
}
