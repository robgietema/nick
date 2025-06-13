---
nav_order: 30
permalink: /related
---

# Generate

This endpoint can be used to fetch related documents. For this endpoint to work you need to setup the different AI models as specified on the homepage of this documentation. The `@related` endpoint will return all the related documents based on embedding vectors. You can do the following request:

```
{% include_relative examples/related/get.req %}
```

Or use the client directly:

```
{% include_relative examples/related/get.ts %}
```

Example response:

```
{% include_relative examples/related/get.res %}
```
