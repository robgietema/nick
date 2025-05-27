---
nav_order: 10
permalink: /types
---

# Types

Available content types can be listed and queried by accessing the `/@types` endpoint on any context (requires an authenticated user). The 'addable' key specifies if the content type can be added to the current context.

```
{% include_relative examples/types/list.req %}
```

Or use the client directly:

```
{% include_relative examples/types/list.ts %}
```

```
{% include_relative examples/types/list.res %}
```

## Get the schema with GET

To get the schema of a content type, access the `/@types` endpoint with the name of the content type, e.g. /@types/Page:

```
{% include_relative examples/types/get.req %}
```

Or use the client directly:

```
{% include_relative examples/types/get.ts %}
```

```
{% include_relative examples/types/get.res %}
```
