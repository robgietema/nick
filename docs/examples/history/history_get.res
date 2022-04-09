HTTP/1.1 200 OK
Content-Type: application/json

[
    {
        "@id": "http://localhost:8000/news/@history/1",
        "action": "Edited",
        "actor": {
            "@id": "http://localhost:8000/news/@users/admin",
            "fullname": "Admin",
            "id": "admin",
            "username": "admin"
        },
        "comments": "Changed title",
        "may_revert": true,
        "time": "2022-04-02T20:22:00.000Z",
        "transition_title": "Edited",
        "type": "versioning",
        "version": 1
    },
    {
        "@id": "http://localhost:8000/news/@history/0",
        "action": "Edited",
        "actor": {
            "@id": "http://localhost:8000/news/@users/admin",
            "fullname": "Admin",
            "id": "admin",
            "username": "admin"
        },
        "comments": "Initial version",
        "may_revert": true,
        "time": "2022-04-02T20:22:00.000Z",
        "transition_title": "Edited",
        "type": "versioning",
        "version": 0
    }
]
