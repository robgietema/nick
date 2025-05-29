---
nav_order: 18
permalink: /controlpanels
---

# Control panels

Control panels allow you to configure the global site setup. The `@controlpanels` endpoint allows you to list all existing control panels.

## Listing Control Panels

A list of all existing control panels in the portal can be retrieved by sending a `GET` request to the `@controlpanels` endpoint:

```
{% include_relative examples/controlpanels/list.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/list.ts %}
```

Response:

```
{% include_relative examples/controlpanels/list.res %}
```

The following fields are returned:

- `@id`: hypermedia link to the control panel
- `title`: the title of the control panel
- `group`: the group in which the control panel should appear, for example, General, Content, Users, Security, Advanced, or Add-on Configuration.

## Retrieve a single Control Panel

To retrieve a single control panel, send a `GET` request to the URL of the control panel:

```
{% include_relative examples/controlpanels/get.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/get.ts %}
```

Response:

```
{% include_relative examples/controlpanels/get.res %}
```

The following fields are returned:

- `@id`: hypermedia link to the control panel
- `title`: title of the control panel
- `group`: group name of the control panel
- `schema`: JSON Schema of the control panel
- `data`: current values of the control panel

## Updating a Control Panel

To update the settings on a control panel, send a `PATCH` request to control panel resource:

```
{% include_relative examples/controlpanels/patch.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/patch.ts %}
```

A successful response to a `PATCH` request will be indicated by a 204 No Content response:

```
{% include_relative examples/controlpanels/patch.res %}
```

## Control Panels not based on schemas

Control panels which are not based on schemas have a custom `@controlpanels/:panel` endpoint implementation.


### Content Types

`@controlpanels/dexterity-types` is a custom control panel endpoint that will allow you to add, remove, and configure available `types`.

Reading or writing content types require the `Manage Site` permission.

| Verb     | URL                                         | Action                                    |
| -------- | ------------------------------------------- | ----------------------------------------- |
| `GET`    | `/@controlpanels/dexterity-types`           | List configurable content types           |
| `POST`   | `/@controlpanels/dexterity-types`           | Creates a new content type                |
| `GET`    | `/@controlpanels/dexterity-types/{type-id}` | Get the current state of the content type |
| `PATCH`  | `/@controlpanels/dexterity-types/{type-id}` | Update the content type details           |
| `DELETE` | `/@controlpanels/dexterity-types/{type-id}` | Remove the content type                   |


#### Listing Content Types

To list the available content types, send a `GET` request to `@controlpanels/dexterity-types`

```
{% include_relative examples/controlpanels/get_types.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/get_types.ts %}
```

Response:

```
{% include_relative examples/controlpanels/get_types.res %}
```

The following fields are returned:

- `@id`: hypermedia link to the control panel
- `title`: title of the control panel
- `group`: group name of the control panel
- `items`: list of configurable content types


#### Creating a new type with `POST`

To create a new content type, send a `POST` request to the `/@controlpanels/dexterity-types` endpoint:

```
{% include_relative examples/controlpanels/post_types.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/post_types.ts %}
```

Response:

```
{% include_relative examples/controlpanels/post_types.res %}
```


#### Reading a type with `GET`

After a successful `POST`, access the content type by sending a `GET` request to the endpoint `/@controlpanels/dexterity-types/{type-id}`:

```
{% include_relative examples/controlpanels/get_type.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/get_type.ts %}
```

Response:

```
{% include_relative examples/controlpanels/get_type.ts %}
```

#### Updating a type with `PATCH`

To update an existing content type, send a `PATCH` request to the server.
`PATCH` allows to provide just a subset of the resource, that is, the values you actually want to change:

```
{% include_relative examples/controlpanels/patch_type.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/patch_type.ts %}
```

Response:

```
{% include_relative examples/controlpanels/patch_type.res %}
```


#### Removing a type with `DELETE`

Delete an existing content type by sending a `DELETE` request to the URL of an existing content type:

```
{% include_relative examples/controlpanels/delete_type.req %}
```

Or use the client directly:

```
{% include_relative examples/controlpanels/delete_type.ts %}
```

Response:

```
{% include_relative examples/controlpanels/delete_type.res %}
```
