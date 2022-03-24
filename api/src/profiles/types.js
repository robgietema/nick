import { mergeSchemas } from '../helpers';

const dublinCore = {
  fieldsets: [
    {
      fields: ['title', 'description', 'changeNote'],
      id: 'default',
      'title:i18n': 'Default',
    },
    {
      fields: ['id'],
      id: 'settings',
      'title:i18n': 'Settings',
    },
    {
      fields: ['subjects', 'language', 'relatedItems', 'coverage'],
      id: 'categorization',
      'title:i18n': 'Categorization',
    },
    {
      fields: ['rights', 'source', 'publisher'],
      id: 'ownership',
      'title:i18n': 'Ownership',
    },
  ],
  properties: {
    changeNote: {
      'description:i18n':
        'Enter a comment that describes the changes you made.',
      'title:i18n': 'Change Note',
      type: 'string',
    },
    coverage: {
      'description:i18n':
        'The spatial or temporal topic of this item, spatial applicability of this item, or jurisdiction under which this item is relevant.',
      'title:i18n': 'Coverage',
      type: 'string',
    },
    description: {
      'description:i18n': 'A description of this item.',
      'title:i18n': 'Description',
      type: 'string',
      widget: 'textarea',
    },
    id: {
      'description:i18n': 'This name will be displayed in the URL.',
      'title:i18n': 'Identifier',
      type: 'string',
    },
    language: {
      choices: [
        ['nl', 'Dutch'],
        ['en-US', 'English (United States)'],
      ],
      default: 'en-US',
      'description:i18n': 'The language of this item.',
      enum: ['nl', 'en-US'],
      enumNames: ['Dutch', 'English (United States)'],
      'title:i18n': 'Language',
      type: 'string',
    },
    publisher: {
      'description:i18n':
        'An entity responsible for making this item available.',
      'title:i18n': 'Publisher',
      type: 'string',
    },
    relatedItems: {
      additionalItems: true,
      default: [],
      'description:i18n': 'Related resources.',
      items: {
        'description:i18n': '',
        'title:i18n': 'Related',
        type: 'string',
      },
      pattern_options: {
        recentlyUsed: true,
      },
      'title:i18n': 'Related Items',
      type: 'array',
      uniqueItems: true,
      vocabulary: 'plone.app.vocabularies.Catalog',
    },
    rights: {
      'description:i18n':
        'Information about rights held in and over this item.',
      'title:i18n': 'Rights',
      type: 'string',
    },
    source: {
      'description:i18n': 'A related item from which this item is derived.',
      'title:i18n': 'Source',
      type: 'string',
    },
    subjects: {
      choices: [
        ['Plone', 'Plone'],
        ['Tokyo', 'Tokyo'],
      ],
      'description:i18n': 'The topic of this item.',
      enum: ['Plone', 'Tokyo'],
      enumNames: ['Plone', 'Tokyo'],
      'title:i18n': 'Tags',
      type: 'string',
      vocabulary: 'plone.app.vocabularies.Keywords',
    },
    title: {
      'description:i18n': 'A name given to this item.',
      'title:i18n': 'Title',
      type: 'string',
    },
  },
  required: ['title'],
};

const layout = {
  fieldsets: [
    {
      fields: ['blocks', 'blocks_layout'],
      id: 'layout',
      'title:i18n': 'Layout',
    },
  ],
  properties: {
    blocks: {
      default: {},
      'description:i18n':
        'The JSON representation of the object blocks information. Must be a JSON object.',
      'title:i18n': 'Blocks',
      type: 'dict',
      widget: 'json',
    },
    blocks_layout: {
      default: {
        items: [],
      },
      'description:i18n':
        'The JSON representation of the object blocks layout. Must be a JSON array.',
      'title:i18n': 'Blocks Layout',
      type: 'dict',
      widget: 'json',
    },
  },
  required: [],
};

const dates = {
  fieldsets: [
    {
      fields: ['effective', 'expires'],
      id: 'dates',
      'title:i18n': 'Dates',
    },
  ],
  properties: {
    effective: {
      'description:i18n':
        'If this date is in the future, the content will not show up in listings and searches until this date.',
      'title:i18n': 'Publishing Date',
      type: 'string',
      widget: 'datetime',
    },
    expires: {
      'description:i18n':
        'When this date is reached, the content will no longer be visible in listings and searches.',
      'title:i18n': 'Expiration Date',
      type: 'string',
      widget: 'datetime',
    },
  },
  required: [],
};

const image = {
  fieldsets: [
    {
      fields: ['image'],
      id: 'default',
      'title:i18n': 'Default',
    },
  ],
  properties: {
    image: {
      'description:i18n': '',
      'title:i18n': 'Image',
      type: 'object',
      widget: 'file',
      factory: 'Image',
    },
  },
  required: ['image'],
};

const file = {
  fieldsets: [
    {
      fields: ['file'],
      id: 'default',
      'title:i18n': 'Default',
    },
  ],
  properties: {
    file: {
      'description:i18n': '',
      'title:i18n': 'File',
      type: 'object',
      widget: 'file',
      factory: 'File',
    },
  },
  required: ['file'],
};

export default {
  purge: true,
  types: [
    {
      id: 'Site',
      'title:i18n': 'Site',
      addable: false,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Folder',
      'title:i18n': 'Folder',
      addable: true,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Page',
      'title:i18n': 'Page',
      addable: true,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Image',
      'title:i18n': 'Image',
      addable: true,
      schema: mergeSchemas(dublinCore, dates, image),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'File',
      'title:i18n': 'File',
      addable: true,
      schema: mergeSchemas(dublinCore, dates, file),
      workflow: 'simple_publication_workflow',
    },
  ],
};
