import { mergeSchemas } from '../src/helpers';

const dublinCore = {
  fieldsets: [
    {
      fields: ['title', 'description', 'changeNote'],
      id: 'default',
      title: 'Default',
    },
    {
      fields: ['id'],
      id: 'settings',
      title: 'Settings',
    },
    {
      fields: ['subjects', 'language', 'relatedItems', 'coverage'],
      id: 'categorization',
      title: 'Categorization',
    },
    {
      fields: ['rights', 'source', 'publisher'],
      id: 'ownership',
      title: 'Ownership',
    },
  ],
  properties: {
    changeNote: {
      description: 'Enter a comment that describes the changes you made.',
      title: 'Change Note',
      type: 'string',
    },
    coverage: {
      description:
        'The spatial or temporal topic of this item, spatial applicability of this item, or jurisdiction under which this item is relevant.',
      title: 'Coverage',
      type: 'string',
    },
    description: {
      description: 'A description of this item.',
      title: 'Description',
      type: 'string',
      widget: 'textarea',
    },
    id: {
      description: 'This name will be displayed in the URL.',
      title: 'Identifier',
      type: 'string',
    },
    language: {
      choices: [
        ['nl', 'Dutch'],
        ['en-US', 'English (United States)'],
      ],
      default: 'en-US',
      description: 'The language of this item.',
      enum: ['nl', 'en-US'],
      enumNames: ['Dutch', 'English (United States)'],
      title: 'Language',
      type: 'string',
    },
    publisher: {
      description: 'An entity responsible for making this item available.',
      title: 'Publisher',
      type: 'string',
    },
    relatedItems: {
      additionalItems: true,
      default: [],
      description: 'Related resources.',
      items: {
        description: '',
        title: 'Related',
        type: 'string',
      },
      pattern_options: {
        recentlyUsed: true,
      },
      title: 'Related Items',
      type: 'array',
      uniqueItems: true,
      vocabulary: 'plone.app.vocabularies.Catalog',
    },
    rights: {
      description: 'Information about rights held in and over this item.',
      title: 'Rights',
      type: 'string',
    },
    source: {
      description: 'A related item from which this item is derived.',
      title: 'Source',
      type: 'string',
    },
    subjects: {
      choices: [
        ['Plone', 'Plone'],
        ['Tokyo', 'Tokyo'],
      ],
      description: 'The topic of this item.',
      enum: ['Plone', 'Tokyo'],
      enumNames: ['Plone', 'Tokyo'],
      title: 'Tags',
      type: 'string',
      vocabulary: 'plone.app.vocabularies.Keywords',
    },
    title: {
      description: 'A name given to this item.',
      title: 'Title',
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
      title: 'Layout',
    },
  ],
  properties: {
    blocks: {
      default: {},
      description:
        'The JSON representation of the object blocks information. Must be a JSON object.',
      title: 'Blocks',
      type: 'dict',
      widget: 'json',
    },
    blocks_layout: {
      default: {
        items: [],
      },
      description:
        'The JSON representation of the object blocks layout. Must be a JSON array.',
      title: 'Blocks Layout',
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
      title: 'Dates',
    },
  ],
  properties: {
    effective: {
      description:
        'If this date is in the future, the content will not show up in listings and searches until this date.',
      title: 'Publishing Date',
      type: 'string',
      widget: 'datetime',
    },
    expires: {
      description:
        'When this date is reached, the content will no longer be visible in listings and searches.',
      title: 'Expiration Date',
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
      title: 'Default',
    },
  ],
  properties: {
    image: {
      description: '',
      title: 'Image',
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
      title: 'Default',
    },
  ],
  properties: {
    file: {
      description: '',
      title: 'File',
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
      title: 'Site',
      addable: false,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Folder',
      title: 'Folder',
      addable: true,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Page',
      title: 'Page',
      addable: true,
      schema: mergeSchemas(dublinCore, layout, dates),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'Image',
      title: 'Image',
      addable: true,
      schema: mergeSchemas(dublinCore, dates, image),
      workflow: 'simple_publication_workflow',
    },
    {
      id: 'File',
      title: 'File',
      addable: true,
      schema: mergeSchemas(dublinCore, dates, file),
      workflow: 'simple_publication_workflow',
    },
  ],
};
