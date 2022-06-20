---
nav_order: 7
permalink: /workflow
---

# Workflow

All content has a workflow attached. We can get the current state and history of an object by issuing a `GET` request using on any context:

```
{% include_relative examples/workflow/get.req %}
```

```
{% include_relative examples/workflow/get.res %}
```

Now, if we want to change the state of the front page to publish, we would proceed by issuing a `POST` request to the given URL:

```
{% include_relative examples/workflow/post.req %}
```

```
{% include_relative examples/workflow/post.res %}
```
