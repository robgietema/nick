/**
 * Action route.
 * @module routes/actions/actions
 */

import { getUrl } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@querystring',
    permission: 'View',
    handler: async (req, trx) => ({
      json: {
        '@id': `${getUrl(req)}${req.document.path}/@querystring`,
        indexes: {
          Creator: {
            description: 'The person that created an item',
            enabled: true,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.string.currentUser',
              'plone.app.querystring.operation.selection.any',
            ],
            operators: {
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
              'plone.app.querystring.operation.string.currentUser': {
                description: 'The user viewing the querystring results',
                operation: 'plone.app.querystring.queryparser._currentUser',
                title: 'Current logged in user',
                widget: null,
              },
            },
            sortable: true,
            title: 'Creator',
            values: {},
            vocabulary: 'plone.app.vocabularies.Users',
          },
          Description: {
            description: "An item's description",
            enabled: true,
            group: 'Text',
            operations: ['plone.app.querystring.operation.string.contains'],
            operators: {
              'plone.app.querystring.operation.string.contains': {
                description: null,
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Contains',
                widget: 'StringWidget',
              },
            },
            sortable: false,
            title: 'Description',
            values: {},
            vocabulary: null,
          },
          SearchableText: {
            description: "Text search of an item's contents",
            enabled: true,
            group: 'Text',
            operations: ['plone.app.querystring.operation.string.contains'],
            operators: {
              'plone.app.querystring.operation.string.contains': {
                description: null,
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Contains',
                widget: 'StringWidget',
              },
            },
            sortable: false,
            title: 'Searchable text',
            values: {},
            vocabulary: null,
          },
          Subject: {
            description: 'Tags are used for organization of content',
            enabled: true,
            group: 'Text',
            operations: [
              'plone.app.querystring.operation.selection.any',
              'plone.app.querystring.operation.selection.all',
            ],
            operators: {
              'plone.app.querystring.operation.selection.all': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._all',
                title: 'Matches all of',
                widget: 'MultipleSelectionWidget',
              },
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
            },
            sortable: false,
            title: 'Tag',
            values: {
              dog: {
                title: 'dog',
              },
            },
            vocabulary: 'plone.app.vocabularies.Keywords',
          },
          Title: {
            description: "Text search of an item's title",
            enabled: true,
            group: 'Text',
            operations: ['plone.app.querystring.operation.string.contains'],
            operators: {
              'plone.app.querystring.operation.string.contains': {
                description: null,
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Contains',
                widget: 'StringWidget',
              },
            },
            sortable: false,
            title: 'Title',
            values: {},
            vocabulary: null,
          },
          created: {
            description: 'The date an item was created',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Creation date',
            values: {},
            vocabulary: null,
          },
          effective: {
            description: 'The time and date an item was first published',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Effective date',
            values: {},
            vocabulary: null,
          },
          effectiveRange: {
            description: 'Querying this is undefined',
            enabled: false,
            group: 'Dates',
            operations: [],
            operators: {},
            sortable: false,
            title: 'Effective range',
            values: {},
            vocabulary: null,
          },
          end: {
            description: 'The end date and time of an event',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Event end date',
            values: {},
            vocabulary: null,
          },
          expires: {
            description: 'The time and date an item was expired',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Expiration date',
            values: {},
            vocabulary: null,
          },
          getId: {
            description: 'The short name of an item (used in the url)',
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.string.is'],
            operators: {
              'plone.app.querystring.operation.string.is': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._equal',
                title: 'Is',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Short name (id)',
            values: {},
            vocabulary: null,
          },
          getObjPositionInParent: {
            description: 'The order of an item in its parent folder',
            enabled: false,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.int.is',
              'plone.app.querystring.operation.int.lessThan',
              'plone.app.querystring.operation.int.largerThan',
            ],
            operators: {
              'plone.app.querystring.operation.int.is': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intEqual',
                title: 'Equals',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.int.largerThan': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intLargerThan',
                title: 'Larger than',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.int.lessThan': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intLessThan',
                title: 'Less than',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Order in folder',
            values: {},
            vocabulary: null,
          },
          getRawRelatedItems: {
            description: 'Find items related to the selected items',
            enabled: false,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.reference.is'],
            operators: {
              'plone.app.querystring.operation.reference.is': {
                description: null,
                operation: 'plone.app.querystring.queryparser._referenceIs',
                title: 'Equals',
                widget: 'ReferenceWidget',
              },
            },
            sortable: false,
            title: 'Related To',
            values: {},
            vocabulary: null,
          },
          isDefaultPage: {
            description:
              'Find items that are the default view for their containing folder.',
            enabled: false,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.boolean.isTrue',
              'plone.app.querystring.operation.boolean.isFalse',
            ],
            operators: {
              'plone.app.querystring.operation.boolean.isFalse': {
                description: null,
                operation: 'plone.app.querystring.queryparser._isFalse',
                title: 'No',
                widget: null,
              },
              'plone.app.querystring.operation.boolean.isTrue': {
                description: null,
                operation: 'plone.app.querystring.queryparser._isTrue',
                title: 'Yes',
                widget: null,
              },
            },
            sortable: false,
            title: 'Default Page',
            values: {},
            vocabulary: null,
          },
          isFolderish: {
            description: 'Find items that can contain other objects',
            enabled: false,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.boolean.isTrue',
              'plone.app.querystring.operation.boolean.isFalse',
            ],
            operators: {
              'plone.app.querystring.operation.boolean.isFalse': {
                description: null,
                operation: 'plone.app.querystring.queryparser._isFalse',
                title: 'No',
                widget: null,
              },
              'plone.app.querystring.operation.boolean.isTrue': {
                description: null,
                operation: 'plone.app.querystring.queryparser._isTrue',
                title: 'Yes',
                widget: null,
              },
            },
            sortable: false,
            title: 'Folder-like',
            values: {},
            vocabulary: null,
          },
          modified: {
            description: 'The time and date an item was last modified',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Modification date',
            values: {},
            vocabulary: null,
          },
          path: {
            description: 'The location of an item ',
            enabled: true,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.string.absolutePath',
              'plone.app.querystring.operation.string.path',
              'plone.app.querystring.operation.string.relativePath',
            ],
            operators: {
              'plone.app.querystring.operation.string.absolutePath': {
                description: 'Location in the site structure',
                operation: 'plone.app.querystring.queryparser._absolutePath',
                title: 'Absolute path',
                widget: 'ReferenceWidget',
              },
              'plone.app.querystring.operation.string.path': {
                description: 'Location in the navigation structure',
                operation: 'plone.app.querystring.queryparser._navigationPath',
                title: 'Navigation path',
                widget: 'ReferenceWidget',
              },
              'plone.app.querystring.operation.string.relativePath': {
                description: "Use '../' to navigate to parent objects.",
                operation: 'plone.app.querystring.queryparser._relativePath',
                title: 'Relative path',
                widget: 'RelativePathWidget',
              },
            },
            sortable: false,
            title: 'Location',
            values: {},
            vocabulary: null,
          },
          portal_type: {
            description: "An item's type (e.g. Event)",
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.selection.any'],
            operators: {
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
            },
            sortable: false,
            title: 'Type',
            values: {
              Collection: {
                title: 'Collection',
              },
              'Discussion Item': {
                title: 'Comment',
              },
              Document: {
                title: 'Page',
              },
              Event: {
                title: 'Event',
              },
              File: {
                title: 'File',
              },
              Folder: {
                title: 'Folder',
              },
              Image: {
                title: 'Image',
              },
              LRF: {
                title: 'LRF',
              },
              Link: {
                title: 'Link',
              },
              'News Item': {
                title: 'News Item',
              },
            },
            vocabulary: 'plone.app.vocabularies.ReallyUserFriendlyTypes',
          },
          review_state: {
            description: "An item's workflow state (e.g.published)",
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.selection.any'],
            operators: {
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
            },
            sortable: true,
            title: 'Review state',
            values: {
              external: {
                title: 'Externally visible [external]',
              },
              internal: {
                title: 'Internal draft [internal]',
              },
              internally_published: {
                title: 'Internally published [internally_published]',
              },
              pending: {
                title: 'Pending [pending]',
              },
              private: {
                title: 'Private [private]',
              },
              published: {
                title: 'Published [published]',
              },
              rejected: {
                title: 'Rejected [rejected]',
              },
              spam: {
                title: 'Spam [spam]',
              },
              visible: {
                title: 'Public draft [visible]',
              },
            },
            vocabulary: 'plone.app.vocabularies.WorkflowStates',
          },
          show_inactive: {
            description:
              'Select which roles have the permission to view inactive objects',
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.string.showInactive'],
            operators: {
              'plone.app.querystring.operation.string.showInactive': {
                description:
                  'The user roles which are allowed to see inactive content',
                operation: 'plone.app.querystring.queryparser._showInactive',
                title: 'Show Inactive',
                widget: 'MultipleSelectionWidget',
              },
            },
            sortable: false,
            title: 'Show Inactive',
            values: {
              Anonymous: {
                title: 'Anonymous',
              },
              Authenticated: {
                title: 'Authenticated',
              },
              Contributor: {
                title: 'Contributor',
              },
              Editor: {
                title: 'Editor',
              },
              Manager: {
                title: 'Manager',
              },
              Member: {
                title: 'Member',
              },
              Owner: {
                title: 'Owner',
              },
              Reader: {
                title: 'Reader',
              },
              Reviewer: {
                title: 'Reviewer',
              },
              'Site Administrator': {
                title: 'Site Administrator',
              },
            },
            vocabulary: 'plone.app.vocabularies.Roles',
          },
          sortable_title: {
            description: "The item's title, transformed for sorting",
            enabled: false,
            group: 'Text',
            operations: [
              'plone.app.querystring.operation.string.contains',
              'plone.app.querystring.operation.string.is',
            ],
            operators: {
              'plone.app.querystring.operation.string.contains': {
                description: null,
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Contains',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.string.is': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._equal',
                title: 'Is',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Sortable Title',
            values: {},
            vocabulary: null,
          },
          start: {
            description: 'The start date and time of an event',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Event start date',
            values: {},
            vocabulary: null,
          },
        },
        sortable_indexes: {
          Creator: {
            description: 'The person that created an item',
            enabled: true,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.string.currentUser',
              'plone.app.querystring.operation.selection.any',
            ],
            operators: {
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
              'plone.app.querystring.operation.string.currentUser': {
                description: 'The user viewing the querystring results',
                operation: 'plone.app.querystring.queryparser._currentUser',
                title: 'Current logged in user',
                widget: null,
              },
            },
            sortable: true,
            title: 'Creator',
            values: {},
            vocabulary: 'plone.app.vocabularies.Users',
          },
          created: {
            description: 'The date an item was created',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Creation date',
            values: {},
            vocabulary: null,
          },
          effective: {
            description: 'The time and date an item was first published',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Effective date',
            values: {},
            vocabulary: null,
          },
          end: {
            description: 'The end date and time of an event',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Event end date',
            values: {},
            vocabulary: null,
          },
          expires: {
            description: 'The time and date an item was expired',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Expiration date',
            values: {},
            vocabulary: null,
          },
          getId: {
            description: 'The short name of an item (used in the url)',
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.string.is'],
            operators: {
              'plone.app.querystring.operation.string.is': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._equal',
                title: 'Is',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Short name (id)',
            values: {},
            vocabulary: null,
          },
          getObjPositionInParent: {
            description: 'The order of an item in its parent folder',
            enabled: false,
            group: 'Metadata',
            operations: [
              'plone.app.querystring.operation.int.is',
              'plone.app.querystring.operation.int.lessThan',
              'plone.app.querystring.operation.int.largerThan',
            ],
            operators: {
              'plone.app.querystring.operation.int.is': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intEqual',
                title: 'Equals',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.int.largerThan': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intLargerThan',
                title: 'Larger than',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.int.lessThan': {
                description: null,
                operation: 'plone.app.querystring.queryparser._intLessThan',
                title: 'Less than',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Order in folder',
            values: {},
            vocabulary: null,
          },
          modified: {
            description: 'The time and date an item was last modified',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Modification date',
            values: {},
            vocabulary: null,
          },
          review_state: {
            description: "An item's workflow state (e.g.published)",
            enabled: true,
            group: 'Metadata',
            operations: ['plone.app.querystring.operation.selection.any'],
            operators: {
              'plone.app.querystring.operation.selection.any': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Matches any of',
                widget: 'MultipleSelectionWidget',
              },
            },
            sortable: true,
            title: 'Review state',
            values: {
              external: {
                title: 'Externally visible [external]',
              },
              internal: {
                title: 'Internal draft [internal]',
              },
              internally_published: {
                title: 'Internally published [internally_published]',
              },
              pending: {
                title: 'Pending [pending]',
              },
              private: {
                title: 'Private [private]',
              },
              published: {
                title: 'Published [published]',
              },
              rejected: {
                title: 'Rejected [rejected]',
              },
              spam: {
                title: 'Spam [spam]',
              },
              visible: {
                title: 'Public draft [visible]',
              },
            },
            vocabulary: 'plone.app.vocabularies.WorkflowStates',
          },
          sortable_title: {
            description: "The item's title, transformed for sorting",
            enabled: false,
            group: 'Text',
            operations: [
              'plone.app.querystring.operation.string.contains',
              'plone.app.querystring.operation.string.is',
            ],
            operators: {
              'plone.app.querystring.operation.string.contains': {
                description: null,
                operation: 'plone.app.querystring.queryparser._contains',
                title: 'Contains',
                widget: 'StringWidget',
              },
              'plone.app.querystring.operation.string.is': {
                description: 'Tip: you can use * to autocomplete.',
                operation: 'plone.app.querystring.queryparser._equal',
                title: 'Is',
                widget: 'StringWidget',
              },
            },
            sortable: true,
            title: 'Sortable Title',
            values: {},
            vocabulary: null,
          },
          start: {
            description: 'The start date and time of an event',
            enabled: true,
            group: 'Dates',
            operations: [
              'plone.app.querystring.operation.date.lessThan',
              'plone.app.querystring.operation.date.largerThan',
              'plone.app.querystring.operation.date.between',
              'plone.app.querystring.operation.date.lessThanRelativeDate',
              'plone.app.querystring.operation.date.largerThanRelativeDate',
              'plone.app.querystring.operation.date.today',
              'plone.app.querystring.operation.date.beforeToday',
              'plone.app.querystring.operation.date.afterToday',
              'plone.app.querystring.operation.date.beforeRelativeDate',
              'plone.app.querystring.operation.date.afterRelativeDate',
            ],
            operators: {
              'plone.app.querystring.operation.date.afterRelativeDate': {
                description: 'After N days in the future',
                operation:
                  'plone.app.querystring.queryparser._afterRelativeDate',
                title: 'After relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.afterToday': {
                description: 'After the current day',
                operation: 'plone.app.querystring.queryparser._afterToday',
                title: 'After today',
                widget: null,
              },
              'plone.app.querystring.operation.date.beforeRelativeDate': {
                description: 'Before N days in the past',
                operation:
                  'plone.app.querystring.queryparser._beforeRelativeDate',
                title: 'Before relative Date',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.beforeToday': {
                description: 'Before the current day',
                operation: 'plone.app.querystring.queryparser._beforeToday',
                title: 'Before today',
                widget: null,
              },
              'plone.app.querystring.operation.date.between': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._between',
                title: 'Between dates',
                widget: 'DateRangeWidget',
              },
              'plone.app.querystring.operation.date.largerThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._largerThan',
                title: 'After date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.largerThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._moreThanRelativeDate',
                title: 'Within last',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.lessThan': {
                description: 'Please use YYYY/MM/DD.',
                operation: 'plone.app.querystring.queryparser._lessThan',
                title: 'Before date',
                widget: 'DateWidget',
              },
              'plone.app.querystring.operation.date.lessThanRelativeDate': {
                description: 'Please enter the number in days.',
                operation:
                  'plone.app.querystring.queryparser._lessThanRelativeDate',
                title: 'Within next',
                widget: 'RelativeDateWidget',
              },
              'plone.app.querystring.operation.date.today': {
                description: 'The current day',
                operation: 'plone.app.querystring.queryparser._today',
                title: 'Today',
                widget: null,
              },
            },
            sortable: true,
            title: 'Event start date',
            values: {},
            vocabulary: null,
          },
        },
      },
    }),
  },
];
