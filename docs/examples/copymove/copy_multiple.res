HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "source": "http://localhost:8000/events",
    "target": "http://localhost:8000/news/events"
  },
  {
    "source": "http://localhost:8000/users",
    "target": "http://localhost:8000/news/users"
  }
]
