---
nav_order: 12
permalink: /groups
---

# Groups

Available groups can be created, queried, updated and deleted by interacting with the `/@groups` endpoint on portal root (requires an authenticated user):

## List groups

To retrieve a list of all current groups in the portal, call the `/@groups` endpoint with a `GET` request:

```
{% include_relative examples/groups/list.req %}
```

The server will respond with a list of all groups in the portal:

```
{% include_relative examples/groups/list.res %}
```

The endpoint supports some basic filtering:

```
{% include_relative examples/groups/list_query.req %}
```

The server will respond with a list the filtered groups in the portal with groupname starts with the query.

```
{% include_relative examples/groups/list_query.res %}
```

## Create Group

To create a new group, send a `POST` request to the global `/@groups` endpoint with a JSON representation of the group you want to create in the body:

```
{% include_relative examples/groups/post.req %}
```

If the group has been created successfully, the server will respond with a status `201 Created`. The `Location` header contains the URL of the newly created group and the resource representation in the payload:

```
{% include_relative examples/groups/post.res %}
```

## Read Group

To retrieve all details for a particular group, send a `GET` request to the `/@groups` endpoint and append the group id to the URL:

```
{% include_relative examples/groups/get.req %}
```

The server will respond with a `200 OK` status code and the JSON representation of the group in the body:

```
{% include_relative examples/groups/get.res %}
```

## Update Group

To update the settings of a group, send a `PATCH` request with the group details you want to amend to the URL of that particular group:

```
{% include_relative examples/groups/patch.req %}
```

A successful response to a `PATCH` request will be indicated by a `204 No Content` response:

```
{% include_relative examples/groups/patch.res %}
```

## Delete Group

To delete a group send a `DELETE` request to the `/@groups` endpoint and append the group id of the group you want to delete:

```
{% include_relative examples/groups/delete.req %}
```

A successful response will be indicated by a `204 No Content` response:

```
{% include_relative examples/groups/delete.res %}
```
