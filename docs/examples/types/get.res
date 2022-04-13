HTTP/1.1 200 OK
Content-Type: application/json

{
  "required": [
    "title"
  ],
  "fieldsets": [
    {
      "id": "default",
      "title": "Default",
      "fields": [
        "title",
        "description",
        "changeNote"
      ]
    },
    {
      "id": "categorization",
      "title": "Categorization",
      "fields": [
        "subjects",
        "language",
        "relatedItems",
        "coverage"
      ]
    },
    {
      "id": "ownership",
      "title": "Ownership",
      "fields": [
        "rights",
        "source",
        "publisher"
      ]
    },
    {
      "id": "dates",
      "title": "Dates",
      "fields": [
        "effective",
        "expires"
      ]
    },
    {
      "id": "layout",
      "title": "Layout",
      "fields": [
        "blocks",
        "blocks_layout"
      ]
    },
    {
      "id": "settings",
      "title": "Settings",
      "fields": [
        "id"
      ]
    }
  ],
  "properties": {
    "id": {
      "type": "string",
      "title": "Identifier",
      "description": "This name will be displayed in the URL."
    },
    "title": {
      "type": "string",
      "title": "Title",
      "description": "A name given to this item."
    },
    "blocks": {
      "type": "dict",
      "title": "Blocks",
      "widget": "json",
      "default": {},
      "description": "The JSON representation of the object blocks information. Must be a JSON object."
    },
    "rights": {
      "type": "string",
      "title": "Rights",
      "description": "Information about rights held in and over this item."
    },
    "source": {
      "type": "string",
      "title": "Source",
      "description": "A related item from which this item is derived."
    },
    "expires": {
      "type": "string",
      "title": "Expiration Date",
      "widget": "datetime",
      "description": "When this date is reached, the content will no longer be visible in listings and searches."
    },
    "coverage": {
      "type": "string",
      "title": "Coverage",
      "description": "The spatial or temporal topic of this item, spatial applicability of this item, or jurisdiction under which this item is relevant."
    },
    "language": {
      "enum": [
        "nl",
        "en-US"
      ],
      "type": "string",
      "title": "Language",
      "choices": [
        [
          "nl",
          "Dutch"
        ],
        [
          "en-US",
          "English (United States)"
        ]
      ],
      "default": "en-US",
      "enumNames": [
        "Dutch",
        "English (United States)"
      ],
      "description": "The language of this item."
    },
    "subjects": {
      "enum": [
        "Plone",
        "Tokyo"
      ],
      "type": "string",
      "title": "Tags",
      "choices": [
        [
          "Plone",
          "Plone"
        ],
        [
          "Tokyo",
          "Tokyo"
        ]
      ],
      "enumNames": [
        "Plone",
        "Tokyo"
      ],
      "vocabulary": "plone.app.vocabularies.Keywords",
      "description": "The topic of this item."
    },
    "effective": {
      "type": "string",
      "title": "Publishing Date",
      "widget": "datetime",
      "description": "If this date is in the future, the content will not show up in listings and searches until this date."
    },
    "publisher": {
      "type": "string",
      "title": "Publisher",
      "description": "An entity responsible for making this item available."
    },
    "changeNote": {
      "type": "string",
      "title": "Change Note",
      "description": "Enter a comment that describes the changes you made."
    },
    "description": {
      "type": "string",
      "title": "Description",
      "widget": "textarea",
      "description": "defaultMessage:"
    },
    "relatedItems": {
      "type": "array",
      "items": {
        "type": "string",
        "title": "Related",
        "description": ""
      },
      "title": "Related Items",
      "default": [],
      "vocabulary": "plone.app.vocabularies.Catalog",
      "description": "Related resources.",
      "uniqueItems": true,
      "additionalItems": true,
      "pattern_options": {
        "recentlyUsed": true
      }
    },
    "blocks_layout": {
      "type": "dict",
      "title": "Blocks Layout",
      "widget": "json",
      "default": {
        "items": []
      },
      "description": "The JSON representation of the object blocks layout. Must be a JSON array."
    }
  },
  "title": "Page"
}
