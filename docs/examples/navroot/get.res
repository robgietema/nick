HTTP/1.1 200 OK
Content-Type: application/json

{
  "title": "Welcome to Nick!",
  "blocks": {
    "495efb73-cbdd-4bef-935a-a56f70a20854": {
      "text": {
        "blocks": [
          {
            "key": "9f35d",
            "data": {},
            "text": "This is the demo site of Nick and is build with the Volto frontend.",
            "type": "unstyled",
            "depth": 0,
            "entityRanges": [
              { "key": 0, "length": 4, "offset": 25 },
              { "key": 1, "length": 5, "offset": 52 }
            ],
            "inlineStyleRanges": []
          }
        ],
        "entityMap": {
          "0": {
            "data": { "url": "https://nickcms.org" },
            "type": "LINK",
            "mutability": "MUTABLE"
          },
          "1": {
            "data": { "url": "https://voltocms.com" },
            "type": "LINK",
            "mutability": "MUTABLE"
          }
        }
      },
      "@type": "text"
    },
    "6a6d1e67-fefd-4049-98a3-300f0302abcb": {
      "text": {
        "blocks": [
          {
            "key": "3jol2",
            "data": {},
            "text": "You can use this site to test the latest version of Nick. You can login with username admin and password admin.",
            "type": "unstyled",
            "depth": 0,
            "entityRanges": [{ "key": 0, "length": 4, "offset": 52 }],
            "inlineStyleRanges": [
              { "style": "ITALIC", "length": 8, "offset": 77 },
              { "style": "ITALIC", "length": 8, "offset": 96 },
              { "style": "BOLD", "length": 5, "offset": 86 },
              { "style": "BOLD", "length": 5, "offset": 105 }
            ]
          }
        ],
        "entityMap": {
          "0": {
            "data": { "url": "https://nickcms.org" },
            "type": "LINK",
            "mutability": "MUTABLE"
          }
        }
      },
      "@type": "text"
    },
    "79ba8858-1dd3-4719-b731-5951e32fbf79": { "@type": "title" },
    "be383a3d-7409-42b5-a5bc-555e2fbf068d": {
      "text": {
        "blocks": [
          {
            "key": "atc31",
            "data": {},
            "text": "This instance is reset every night so feel free to make any changes!",
            "type": "unstyled",
            "depth": 0,
            "entityRanges": [],
            "inlineStyleRanges": []
          }
        ],
        "entityMap": {}
      },
      "@type": "text"
    },
    "eb024f35-ab6a-4034-ac5b-77c91fe3d400": {
      "text": {
        "blocks": [
          {
            "key": "5s8ah",
            "data": {},
            "text": "Demo",
            "type": "header-three",
            "depth": 0,
            "entityRanges": [],
            "inlineStyleRanges": []
          }
        ],
        "entityMap": {}
      },
      "@type": "text"
    }
  },
  "effective": "2022-04-02T20:00:00.000Z",
  "description": "Congratulations! You have successfully installed Nick.",
  "blocks_layout": {
    "items": [
      "79ba8858-1dd3-4719-b731-5951e32fbf79",
      "495efb73-cbdd-4bef-935a-a56f70a20854",
      "eb024f35-ab6a-4034-ac5b-77c91fe3d400",
      "6a6d1e67-fefd-4049-98a3-300f0302abcb",
      "be383a3d-7409-42b5-a5bc-555e2fbf068d"
    ]
  },
  "items": [
    {
      "title": "Events",
      "blocks": { "79ba8858-1dd3-4719-b731-5951e32fbf79": { "@type": "title" } },
      "effective": "2022-04-02T20:30:00.000Z",
      "blocks_layout": { "items": ["79ba8858-1dd3-4719-b731-5951e32fbf79"] },
      "@id": "http://localhost:8000/events",
      "@type": "Folder",
      "id": "events",
      "created": "2022-04-02T20:30:00.000Z",
      "modified": "2022-04-02T20:30:00.000Z",
      "UID": "1a2123ba-14e8-4910-8e6b-c04a40d72a41",
      "owner": "admin",
      "layout": "view",
      "is_folderish": true,
      "language": { "token": "en", "title": "English" },
      "review_state": "published",
      "lock": { "locked": false, "stealable": true }
    },
    {
      "title": "News",
      "blocks": { "79ba8858-1dd3-4719-b731-5951e32fbf79": { "@type": "title" } },
      "effective": "2022-04-02T20:22:00.000Z",
      "description": "News Items",
      "blocks_layout": { "items": ["79ba8858-1dd3-4719-b731-5951e32fbf79"] },
      "@id": "http://localhost:8000/news",
      "@type": "Folder",
      "id": "news",
      "created": "2022-04-02T20:22:00.000Z",
      "modified": "2022-04-02T20:22:00.000Z",
      "UID": "32215c67-86de-462a-8cc0-eabcd2b39c26",
      "owner": "admin",
      "layout": "view",
      "is_folderish": true,
      "language": { "token": "en", "title": "English" },
      "review_state": "published",
      "lock": { "locked": false, "stealable": true }
    },
    {
      "title": "Users",
      "blocks": { "79ba8858-1dd3-4719-b731-5951e32fbf79": { "@type": "title" } },
      "effective": "2022-04-02T20:24:00.000Z",
      "blocks_layout": { "items": ["79ba8858-1dd3-4719-b731-5951e32fbf79"] },
      "@id": "http://localhost:8000/users",
      "@type": "Folder",
      "id": "users",
      "created": "2022-04-02T20:24:00.000Z",
      "modified": "2022-04-02T20:24:00.000Z",
      "UID": "80994493-74ca-4b94-9a7c-145a33a6dd80",
      "owner": "admin",
      "layout": "view",
      "is_folderish": true,
      "language": { "token": "en", "title": "English" },
      "review_state": "published",
      "lock": { "locked": false, "stealable": true }
    }
  ],
  "@id": "http://localhost:8000",
  "@type": "Site",
  "id": "root",
  "created": "2022-04-02T20:00:00.000Z",
  "modified": "2022-04-02T20:00:00.000Z",
  "UID": "92a80817-f5b7-400d-8f58-b08126f0f09b",
  "owner": "admin",
  "layout": "view",
  "is_folderish": true,
  "language": { "token": "en", "title": "English" },
  "review_state": "published",
  "lock": { "locked": false, "stealable": true }
}
