---
nav_order: 25
permalink: /translations
---

# Translations

Multilingual is included in Nick. It is not enabled by default.

You can enable the multilingual support by adding the `multilingual` profile to your configuration file. You can also replace the `default` profile with the `multilingualcontent` profile if you want to your initial content to be multilingual.

Nick provides a `@translations` endpoint to handle the translation information of the content objects.

Once we enabled more than one language, we can link two content items of different languages to be the translation of each other issuing a `POST` query to the `@translations` endpoint, including the `id` of the content to which it should be linked. The `id` of the content must be a full URL of the content object:

```
{% include_relative examples/translations/post_url.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/post_url.ts %}
```

The API will return a 201 Created response, if the linking was successful:

```
{% include_relative examples/translations/post_url.res %}
```

We can also use the object's path to link the translation instead of the full URL:

```
{% include_relative examples/translations/post_path.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/post_path.ts %}
```

```
{% include_relative examples/translations/post_path.res %}
```

We can also use the object's UID to link the translation:

```
{% include_relative examples/translations/post_uuid.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/post_uuid.ts %}
```

```
{% include_relative examples/translations/post_uuid.res %}
```

After linking the contents, we can get the list of the translations of that content item by issuing a `GET` request on the `@translations` endpoint of that content item:

```
{% include_relative examples/translations/get.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/get.ts %}
```

```
{% include_relative examples/translations/get.res %}
```

To unlink the content, issue a `DELETE` request on the `@translations` endpoint of the content item, and provide the language code you want to unlink:

```
{% include_relative examples/translations/delete.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/delete.ts %}
```

```
{% include_relative examples/translations/delete.res %}
```

## Creating a translation from an existing content

The `POST` content endpoint to a folder is also capable of linking this new content with an existing translation using two parameters: `translationOf` and `language`.

```
{% include_relative examples/translations/post.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/post.ts %}
```

```
{% include_relative examples/translations/post.res %}
```

## Get location in the tree for new translations

When you create a translation in Plone, there are policies in place for finding a suitable placement for it. This endpoint returns the proper placement for the newly created translation:

```
{% include_relative examples/translations/get_locator.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/get_locator.ts %}
```

```
{% include_relative examples/translations/get_locator.res %}
```

## Expansion

This service can be used with the Expansion mechanism which allows getting additional information about a content item in one query, avoiding additional requests.

Translation information can be provided by the API expansion for translatable content items.

If a simple `GET` request is done on the content item, a new entry will be shown on the `@components` entry, with the URL of the `@translations` endpoint:

```
{% include_relative examples/translations/get_expansion.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/get_expansion.ts %}
```

```
{% include_relative examples/translations/get_expansion.res %}
```

In order to expand and embed the translations component, use the GET parameter expand with the value translations.

```
{% include_relative examples/translations/get_expansion_expanded.req %}
```

Or use the client directly:

```
{% include_relative examples/translations/get_expansion_expanded.ts %}
```

```
{% include_relative examples/translations/get_expansion_expanded.res %}
```
