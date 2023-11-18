---
nav_order: 24
permalink: /site
---

# Site

The `@site` endpoint provides general site-wide information, such as the site title, logo, and other information. It uses the view permission, which requires appropriate authorization.

Send a `GET` request to the `@site` endpoint:

```
{% include_relative examples/site/get.req %}
```

The response will contain the site information:

```
{% include_relative examples/site/get.res %}
```
