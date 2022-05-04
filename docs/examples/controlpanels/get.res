HTTP/1.1 200 OK
Content-Type: application/json

{
  "@id": "http://localhost:8000/@controlpanels/mail",
  "group": "General",
  "title": "Mail",
  "data": {
    "host": "localhost",
    "pass": "",
    "port": 25,
    "user": "",
    "debug": true,
    "secure": true,
    "email_from_name": "Webmaster",
    "email_from_address": "webmaster@nickcms.org"
  },
  "schema": {
    "required": ["host", "port", "email_from_name", "email_from_address"],
    "fieldsets": [
      {
        "id": "default",
        "title": "Default",
        "fields": [
          "host",
          "port",
          "secure",
          "user",
          "pass",
          "email_from_name",
          "email_from_address",
          "debug"
        ],
        "behavior": "plone"
      }
    ],
    "properties": {
      "host": {
        "type": "string",
        "title": "SMTP server",
        "default": "localhost",
        "description": "The address of your local SMTP (outgoing e-mail) server. Usually 'localhost', unless you use an external server to send e-mail."
      },
      "pass": {
        "type": "string",
        "title": "ESMTP password",
        "widget": "password",
        "description": "The password for the ESMTP user account."
      },
      "port": {
        "type": "integer",
        "title": "SMTP port",
        "default": 25,
        "description": "The port of your local SMTP (outgoing e-mail) server. Usually '25'."
      },
      "user": {
        "type": "string",
        "title": "ESMTP username",
        "description": "Username for authentication to your e-mail server. Not required unless you are using ESMTP."
      },
      "debug": {
        "type": "boolean",
        "title": "Debug",
        "description": "If enabled the mail is send to a test server."
      },
      "secure": {
        "type": "boolean",
        "title": "Secure",
        "description": "If enabled the mail is send using a secure connection."
      },
      "email_from_name": {
        "type": "string",
        "title": "Site 'From' name",
        "description": "Plone generates e-mail using this name as the e-mail sender."
      },
      "email_from_address": {
        "type": "string",
        "title": "Site 'From' address",
        "description": "Plone generates e-mail using this address as the e-mail return address. It is also used as the destination address for the site-wide contact form and the 'Send test e-mail' feature."
      }
    }
  }
}
