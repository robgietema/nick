HTTP/1.1 201 Created
Content-Type: application/json

{
  "title": "My News Item",
  "description": "News Description",
  "@components": {
    "actions": {
      "@id": "http://localhost:8000/news/@actions"
    },
    "breadcrumbs": {
      "@id": "http://localhost:8000/news/@breadcrumbs"
    },
    "catalog": {
      "@id": "http://localhost:8000/news/@catalog"
    },
    "navigation": {
      "@id": "http://localhost:8000/news/@navigation"
    },
    "navroot": {
      "@id": "http://localhost:8000/news/@navroot"
    },
    "translations": {
      "@id": "http://localhost:8000/news/@translations"
    },
    "types": {
      "@id": "http://localhost:8000/news/@types"
    },
    "workflow": {
      "@id": "http://localhost:8000/news/@workflow"
    }
  },
  "@id": "http://localhost:8000/news/my-news-item",
  "@type": "Page",
  "id": "my-news-item",
  "created": "2022-04-08T16:00:00.000Z",
  "modified": "2022-04-08T16:00:00.000Z",
  "UID": "a95388f2-e4b3-4292-98aa-62656cbd5b9c",
  "is_folderish": true,
  "layout": "view",
  "owner": "admin",
  "review_state": "private",
  "lock": {
    "locked": false,
    "stealable": true
  }
}
