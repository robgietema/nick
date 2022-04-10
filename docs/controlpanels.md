---
sort: 17
permalink: /controlpanels
---

# Control panels

Control panels allow you to configure the global site setup. The @controlpanels endpoint allows you to list all existing control panels.

## Listing Control Panels

A list of all existing control panels in the portal can be retrieved by sending a GET request to the @controlpanels endpoint:

```
{% include_relative examples/controlpanels/controlpanels_get.req %}
```

Response:

```
{% include_relative examples/controlpanels/controlpanels_get.res %}
```
