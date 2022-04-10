---
sort: 18
permalink: /querystring
---

# Querystring

The `@querystring` endpoint returns the querystring config.

Available options for the querystring can be queried by interacting with the `/@querystring` endpoint on portal root:

## Querystring Config

To retrieve all querystring options in the portal, call the `/@querystring` endpoint with a `GET` request:

```
{% include_relative examples/querystring/querystring_get.req %}
```

The server will respond with all querystring options in the portal:

```
{% include_relative examples/querystring/querystring_get.res %}
```
