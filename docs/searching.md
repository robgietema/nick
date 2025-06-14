---
nav_order: 19
permalink: /endpoints/searching
parent: Endpoints
---

# Search

## Searching content

Content can be searched for by invoking the `/@search` endpoint on any context:

```http
{% include_relative examples/search/get.req %}
```

Or use the client directly:

```ts
{% include_relative examples/search/get.ts %}
```

Example response:

```http
{% include_relative examples/search/get.res %}
```

## Searching using an embedding model

When AI is enabled in the config you can search based on `embeddings`. When you provide a `SearchableText` parameter it will be converted to an `embedding` and compared with all other embeddings in the site. You can set the similarity cut off in the config by specifying `minSimilarity` in the embed model settings. Results are automatically ordered by similarity but can be ordered differently when specified.

``http
{% include_relative examples/search/get_embed.req %}

````

Or use the client directly:

```ts
{% include_relative examples/search/get_embed.ts %}
````

Example response:

```http
{% include_relative examples/search/get_embed.res %}
```
