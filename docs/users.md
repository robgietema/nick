---
sort: 10
permalink: /users
---

# Users

Available users can be created, queried, updated and deleted by interacting with the `/@users` endpoint on portal root (requires an authenticated user):

## List Users

To retrieve a list of all current users in the portal, call the `/@users` endpoint with a `GET` request:

```
{% include_relative examples/users/users_list.req %}
```

The server will respond with a list of all users in the portal:

```
{% include_relative examples/users/users_list.res %}
```

This only works for Manager users, anonymous users or logged-in users without Manager rights are now allowed to list users. This is the example as an anonymous user:

```
{% include_relative examples/users/users_list_anonymous.req %}
```

The server will return a 401 Unauthorized status code

```
{% include_relative examples/users/users_list_anonymous.res %}
```

The endpoint supports some basic filtering:

```
{% include_relative examples/users/users_list_query.req %}
```

The server will respond with a list the filtered users in the portal with username starts with the query.

```
{% include_relative examples/users/users_list_query.res %}
```

## Create User

To create a new user, send a `POST` request to the global `/@users` endpoint with a JSON representation of the user you want to create in the body:

```
{% include_relative examples/users/users_post.req %}
```

If the user has been created successfully, the server will respond with a status `201 Created`. The `Location` header contains the URL of the newly created user and the resource representation in the payload:

```
{% include_relative examples/users/users_post.res %}
```

## Read User

To retrieve all details for a particular user, send a `GET` request to the `/@users` endpoint and append the user id to the URL:

```
{% include_relative examples/users/users_get.req %}
```

The server will respond with a `200 OK` status code and the JSON representation of the user in the body:

```
{% include_relative examples/users/users_get.req %}
```

Only users with Manager rights are allowed to get other users' information:

```
{% include_relative examples/users/users_get_anonymous.req %}
```

If the user lacks this rights, the server will respond with a `401 Unauthorized` status code:

```
{% include_relative examples/users/users_get_anonymous.res %}
```

If the specified user doesn't exist:

```
{% include_relative examples/users/users_get_notfound.req %}
```

The server will respond with a `404 Not Found` status code:

```
{% include_relative examples/users/users_get_notfound.res %}
```

## Update User

To update the settings of a user, send a `PATCH` request with the user details you want to amend to the URL of that particular user, e.g. if you want to update the email address of the admin user to:

```
{% include_relative examples/users/users_patch.req %}
```

A successful response to a `PATCH` request will be indicated by a `204 No Content` response:

```
{% include_relative examples/users/users_patch.res %}
```

## Delete User

To delete a user send a `DELETE` request to the `/@users` endpoint and append the user id of the user you want to delete, e.g. to delete the user with the id johndoe:

```
{% include_relative examples/users/users_delete.req %}
```

A successful response will be indicated by a `204 No Content` response:

```
{% include_relative examples/users/users_delete.res %}
```