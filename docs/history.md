---
sort: 4
order: 4
permalink: /history
---

# History

The `@history` endpoint exposes history and versioning information on previous versions of the content. Each change or workflow change on a content object or file is listed. It also allows to revert to a previous version of the file.

## Listing the History of a Content Object

Listing versions and history of a resource:

```
{% include_relative examples/history/get.req %}
```

```
{% include_relative examples/history/get.res %}
```

This following fields are returned:

- `action`: the workflow transition id, 'Edited' for versioning, or 'Create' for initial state.
- `actor`: the user who performed the action. This contains a subobject with the details.
- `comments`: a changenote
- `@id`: link to the content endpoint of this specific version.
- `may_revert`: true if the user has permission to revert.
- `time`: when this action occured in ISO format.
- `transition_title`: the workflow transition's title, 'Edited' for versioning.
- `type`: 'workflow' for workflow changes, or 'versioning' for editing
- `version`: identifier for this specific version of the resource.

## Get a Historical Version

Older versions of a resource can be retrieved by appending version to the `@history` endpoint url.

```
{% include_relative examples/history/get_version.req %}
```

## Revert to a Historical Version

Reverting to an older versions of a resource can be done by sending a PATCH request to the `@history` endpoint and appending the version you want to revert to.

```
{% include_relative examples/history/patch.req %}
```

```
{% include_relative examples/history/patch.res %}
```
