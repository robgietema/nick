---
sort: 20
permalink: /email
---

# Email Send

## Send Mail to Arbitrary Addresses

To send an email to an arbitrary e-mail address, send a POST request to the `@email-send`endpoint that is available on the site root:

```
{% include_relative examples/mail/mail_post.req %}
```

The `to`, `from` and `message` fields are required. The `subject` and `name` fields are optional.

The server will respond with status 204 No Content when the email has been sent successfully:

```
{% include_relative examples/mail/mail_post.res %}
```
