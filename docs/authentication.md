---
nav_order: 2
permalink: /authentication
---

# Authentication

For authentication JSON Web Tokens (JWT) are used.

## JSON Web Tokens (JWT)

### Acquiring a token

A JWT token can be acquired by posting a user's credentials to the `@login` endpoint.

```
{% include_relative examples/authentication/login_post_valid.req %}
```

The server responds with a JSON object containing the token.

```
{% include_relative examples/authentication/login_post_valid.res %}
```

If you send incorrect credentials you will get notified.

```
{% include_relative examples/authentication/login_post_incorrect.req %}
```

```
{% include_relative examples/authentication/login_post_incorrect.res %}
```

If you send credentials for a non-existing user you will also get notified.

```
{% include_relative examples/authentication/login_post_invalid.req %}
```

```
{% include_relative examples/authentication/login_post_invalid.res %}
```

When you don't set all the required fields you will get an error message.

```
{% include_relative examples/authentication/login_post_missing.req %}
```

```
{% include_relative examples/authentication/login_post_missing.res %}
```

### Authenticating with a token

The token can now be used in subsequent requests by including it in the Authorization header with the Bearer scheme:

```
{% include_relative examples/authentication/login_renew_post_valid.req %}
```

### Renewing a token

By default the token will expire after 12 hours and thus must be renewed before expiration. To renew the token simply post to the `@login-renew` endpoint.

```
{% include_relative examples/authentication/login_renew_post_valid.req %}
```

The server returns a JSON object with a new token:

```
{% include_relative examples/authentication/login_renew_post_valid.res %}
```

When you don't provide a session or your session is incorrect:

```
{% include_relative examples/authentication/login_renew_post_invalid.req %}
```

The server responds with an error message:

```
{% include_relative examples/authentication/login_renew_post_invalid.res %}
```

### Invalidating a token

The `@logout` endpoint can be used to invalidate tokens. However by default tokens are not persisted on the server and thus can not be invalidated.

The logout request must contain the existing token in the `Authorization` header.

```
{% include_relative examples/authentication/logout_post.req %}
```

If invalidation succeeds, the server responds with an empty 204 reponse:

```
{% include_relative examples/authentication/logout_post.res %}
```

## Permissions

In order for a user to use the REST API you need common permissions depending on the particular service. For example, retrieving a resource using `GET` will require `View`, adding an object using `POST` will require `Add`, and so on.
