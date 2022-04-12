---
sort: 17
permalink: /vocabularies
---

# Vocabularies

Vocabularies are a set of allowed choices that back a particular field. They contain so called _terms_ which represent those allowed choices.

## Concepts

**Vocabularies** contain a list of terms. These terms are usually tokenized, meaning that in addition to a term's value, it also has a `token` which is a machine-friendly identifier for the term.

Terms can also have a title, which is intended to be the user-facing label for the term.

Vocabularies can be context-sensitive, meaning that they take the context into account and their contents may therefore change depending on the context they're invoked on.

## Listing all vocabularies

To retrieve a list of all the available vocabularies, send a `GET` request to the `@vocabularies` endpoint:

```
{% include_relative examples/vocabularies/vocabularies_list.req %}
```

The response will include a list with the URL (`@id`) and the names (`title`) of all the available vocabularies:

```
{% include_relative examples/vocabularies/vocabularies_list.res %}
```

## Get a vocabulary

To enumerate the terms of a particular vocabulary, use the `@vocabularies` endpoint with the name of the vocabulary, e.g. `/@vocabularies/roles`. The endpoint can be used with the site root and content objects.

```
{% include_relative examples/vocabularies/vocabularies_get.req %}
```

The server will respond with a list of terms. The title is purely for display purposes. The token is what should be sent to the server to address that term.

```
{% include_relative examples/vocabularies/vocabularies_get.res %}
```
