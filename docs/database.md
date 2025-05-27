---
nav_order: 23
permalink: /database
---

# Database

The `@database` endpoint exposes system information about the database.

Send a `GET` request to the `@database` endpoint:

```
{% include_relative examples/database/get.req %}
```

Or use the client directly:

```
{% include_relative examples/database/get.ts %}
```

The response will contain the database information:

```
{% include_relative examples/database/get.res %}
```
