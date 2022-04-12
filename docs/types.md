---
sort: 10
permalink: /types
---

# Types

Available content types can be listed and queried by accessing the `/@types` endpoint on any context (requires an authenticated user). The 'addable' key specifies if the content type can be added to the current context.

```
{% include_relative examples/types/types_list.req %}
```

```
{% include_relative examples/types/types_list.res %}
```

## Get the schema with GET

To get the schema of a content type, access the `/@types` endpoint with the name of the content type, e.g. /@types/Page:

```
{% include_relative examples/types/types_get.req %}
```

```
{% include_relative examples/types/types_get.res %}
```
