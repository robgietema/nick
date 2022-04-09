---
sort: 12
permalink: /roles
---

# Roles

Available roles in a Plone site can be queried by interacting with the `/@roles` endpoint on portal root (requires an authenticated user):

## List Roles

To retrieve a list of all roles in the portal, call the `/@roles` endpoint with a `GET` request:

```
{% include_relative examples/roles/roles_get.req %}
```

The server will respond with a list of all roles in the site:

```
{% include_relative examples/roles/roles_get.res %}
```

The role `title` is the translated role title.
