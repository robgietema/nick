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

A successful response to a `PATCH` request will be indicated by a 204 No Content response:

```
{% include_relative examples/controlpanels/patch.res %}
```
