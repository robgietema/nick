HTTP/1.1 200 OK
Content-Type: application/json


[
  {
    "@id": "http://localhost:8000/news/@history/1",
    "action": "Edited",
    "actor": {
      "@id": "http://localhost:8000/@users/admin",
      "fullname": "Admin",
      "id": "admin",
      "username": "admin"
    },
    "comments": "Changed title",
    "may_revert": true,
    "time": "2022-04-04T22:22:00+02:00",
    "transition_title": "Edited",
    "type": "versioning",
    "version": 1
  },
  {
    "time": "2022-04-03T20:22:00.000Z",
    "actor": {
      "@id": "http://localhost:8000/@users/admin",
      "fullname": "Admin",
      "id": "admin",
      "username": "admin"
    },
    "action": "publish",
    "state_title": "Published",
    "review_state": "published",
    "transition_title": "Publish",
    "comments": "",
    "type": "workflow"
  },
  {
    "@id": "http://localhost:8000/news/@history/0",
    "action": "Edited",
    "actor": {
      "@id": "http://localhost:8000/@users/admin",
      "fullname": "Admin",
      "id": "admin",
      "username": "admin"
    },
    "comments": "Initial version",
    "may_revert": true,
    "time": "2022-04-02T22:22:00+02:00",
    "transition_title": "Edited",
    "type": "versioning",
    "version": 0
  }
]
