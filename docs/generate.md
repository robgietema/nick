---
nav_order: 29
permalink: /generate
---

# Generate

This endpoint can be used as a RAG endpoint. For this endpoint to work you need to setup the different AI models as specified on the homepage of this documentation. The `@generate` endpoint will use the specified LLM in your config and will be augmented by the content from your website using RAG. You can query the LLM with the following request:

```
{% include_relative examples/generate/post.req %}
```

Or use the client directly:

```
{% include_relative examples/generate/post.ts %}
```

Example response:

```
{% include_relative examples/generate/post.res %}
```
