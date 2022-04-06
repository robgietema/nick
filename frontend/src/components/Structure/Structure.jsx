/**
 * Structure components.
 * @module components/Structure/Structure
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { map, keys, indexOf, mapValues } from 'lodash';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Button, Dropdown, Input, Segment, Table } from 'semantic-ui-react';
import {
  Breadcrumbs,
  Circle,
  FormattedDate,
  Pagination,
  Icon,
} from '@plone/volto/components';
import { getContentIcon } from '@plone/volto/helpers';
import dragSVG from '@plone/volto/icons/drag.svg';
import moreSVG from '@plone/volto/icons/more.svg';
import cutSVG from '@plone/volto/icons/cut.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import copySVG from '@plone/volto/icons/copy.svg';
import showSVG from '@plone/volto/icons/show.svg';
import moveUpSVG from '@plone/volto/icons/move-up.svg';
import moveDownSVG from '@plone/volto/icons/move-down.svg';
import editingSVG from '@plone/volto/icons/editing.svg';
import backSVG from '@plone/volto/icons/back.svg';
import tagSVG from '@plone/volto/icons/tag.svg';
import renameSVG from '@plone/volto/icons/rename.svg';
import semaphoreSVG from '@plone/volto/icons/semaphore.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';
import propertiesSVG from '@plone/volto/icons/properties.svg';
import pasteSVG from '@plone/volto/icons/paste.svg';
import zoomSVG from '@plone/volto/icons/zoom.svg';
import checkboxUncheckedSVG from '@plone/volto/icons/checkbox-unchecked.svg';
import checkboxCheckedSVG from '@plone/volto/icons/checkbox-checked.svg';
import checkboxIndeterminateSVG from '@plone/volto/icons/checkbox-indeterminate.svg';
import configurationSVG from '@plone/volto/icons/configuration-app.svg';
import sortDownSVG from '@plone/volto/icons/sort-down.svg';
import sortUpSVG from '@plone/volto/icons/sort-up.svg';
import downKeySVG from '@plone/volto/icons/down-key.svg';
import Indexes, { defaultIndexes } from '@plone/volto/constants/Indexes';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  contents: {
    id: 'Contents',
    defaultMessage: 'Contents',
  },
  copy: {
    id: 'Copy',
    defaultMessage: 'Copy',
  },
  cut: {
    id: 'Cut',
    defaultMessage: 'Cut',
  },
  error: {
    id: "You can't paste this content here",
    defaultMessage: "You can't paste this content here",
  },
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
  deleteConfirm: {
    id: 'Do you really want to delete the following items?',
    defaultMessage: 'Do you really want to delete the following items?',
  },
  deleteError: {
    id: 'The item could not be deleted.',
    defaultMessage: 'The item could not be deleted.',
  },
  loading: {
    id: 'loading',
    defaultMessage: 'Loading',
  },
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
  filter: {
    id: 'Filter…',
    defaultMessage: 'Filter…',
  },
  messageCopied: {
    id: 'Item(s) copied.',
    defaultMessage: 'Item(s) copied.',
  },
  messageCut: {
    id: 'Item(s) cut.',
    defaultMessage: 'Item(s) cut.',
  },
  messageUpdate: {
    id: 'Item(s) has been updated.',
    defaultMessage: 'Item(s) has been updated.',
  },
  messageReorder: {
    id: 'Item succesfully moved.',
    defaultMessage: 'Item succesfully moved.',
  },
  messagePasted: {
    id: 'Item(s) pasted.',
    defaultMessage: 'Item(s) pasted.',
  },
  messageWorkflowUpdate: {
    id: 'Item(s) state has been updated.',
    defaultMessage: 'Item(s) state has been updated.',
  },
  paste: {
    id: 'Paste',
    defaultMessage: 'Paste',
  },
  properties: {
    id: 'Properties',
    defaultMessage: 'Properties',
  },
  rearrangeBy: {
    id: 'Rearrange items by…',
    defaultMessage: 'Rearrange items by…',
  },
  rename: {
    id: 'Rename',
    defaultMessage: 'Rename',
  },
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  selected: {
    id: '{count} selected',
    defaultMessage: '{count} selected',
  },
  selectColumns: {
    id: 'Select columns to show',
    defaultMessage: 'Select columns to show',
  },
  sort: {
    id: 'sort',
    defaultMessage: 'sort',
  },
  state: {
    id: 'State',
    defaultMessage: 'State',
  },
  tags: {
    id: 'Tags',
    defaultMessage: 'Tags',
  },
  upload: {
    id: 'Upload',
    defaultMessage: 'Upload',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  publicationDate: {
    id: 'Publication date',
    defaultMessage: 'Publication date',
  },
  createdOn: {
    id: 'Created on',
    defaultMessage: 'Created on',
  },
  expirationDate: {
    id: 'Expiration date',
    defaultMessage: 'Expiration date',
  },
  id: {
    id: 'ID',
    defaultMessage: 'ID',
  },
  uid: {
    id: 'UID',
    defaultMessage: 'UID',
  },
  reviewState: {
    id: 'Review state',
    defaultMessage: 'Review state',
  },
  folder: {
    id: 'Folder',
    defaultMessage: 'Folder',
  },
  excludedFromNavigation: {
    id: 'Excluded from navigation',
    defaultMessage: 'Excluded from navigation',
  },
  objectSize: {
    id: 'Object Size',
    defaultMessage: 'Object Size',
  },
  lastCommentedDate: {
    id: 'Last comment date',
    defaultMessage: 'Last comment date',
  },
  totalComments: {
    id: 'Total comments',
    defaultMessage: 'Total comments',
  },
  creator: {
    id: 'Creator',
    defaultMessage: 'Creator',
  },
  endDate: {
    id: 'End Date',
    defaultMessage: 'End Date',
  },
  startDate: {
    id: 'Start Date',
    defaultMessage: 'Start Date',
  },
  all: {
    id: 'All',
    defaultMessage: 'All',
  },
  private: {
    id: 'Private',
    defaultMessage: 'Private',
  },
  published: {
    id: 'Published',
    defaultMessage: 'Published',
  },
  intranet: {
    id: 'Intranet',
    defaultMessage: 'Intranet',
  },
  draft: {
    id: 'Draft',
    defaultMessage: 'Draft',
  },
  no_workflow_state: {
    id: 'No workflow state',
    defaultMessage: 'No workflow state',
  },
  none: {
    id: 'None',
    defaultMessage: 'None',
  },
});

function getColor(string) {
  switch (string) {
    case 'private':
      return '#ed4033';
    case 'published':
      return '#007bc1';
    case 'intranet':
      return '#51aa55';
    case 'draft':
      return '#f6a808';
    default:
      return 'grey';
  }
}

/**
 * Structure container class.
 */
export class StructureComponent extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ContentsComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index || {
        order: keys(Indexes),
        values: mapValues(Indexes, (value, key) => ({
          ...value,
          selected: indexOf(defaultIndexes, key) !== -1,
        })),
        selectedCount: defaultIndexes.length + 1,
      },
    };
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div role="navigation" className="folder-contents">
        <div class="ui secondary attached top-menu menu hide-not-full-size">
          <div class="menu top-menu-menu">
            <button class="ui button icon item upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon upload"
                style={{
                  height: '24px',
                  width: 'auto',
                  fill: 'rgb(0, 126, 177)',
                }}
              >
                <g fill-rule="evenodd">
                  <path d="M12.293 22.293L13.707 23.707 17 20.414 17 31 19 31 19 20.414 22.293 23.707 23.707 22.293 18 16.586z"></path>
                  <path d="M28.9707,15.6641 C28.9907,15.4401 28.9997,15.2191 28.9997,15.0001 C28.9997,10.5891 25.4107,7.0001 20.9997,7.0001 C17.9547,7.0001 15.2217,8.7151 13.8727,11.3711 C13.2807,11.1261 12.6477,11.0001 11.9997,11.0001 C9.3517,11.0001 7.1777,13.0691 7.0107,15.6761 C4.5837,16.8221 2.9997,19.2771 2.9997,22.0001 C2.9997,25.8591 6.1407,29.0001 9.9997,29.0001 L11.9997,29.0001 L11.9997,27.0001 L9.9997,27.0001 C7.2427,27.0001 4.9997,24.7571 4.9997,22.0001 C4.9997,19.8761 6.3517,17.9791 8.3627,17.2801 L9.0977,17.0251 L8.9997,16.0001 C8.9997,14.3461 10.3457,13.0001 11.9997,13.0001 C12.6307,13.0001 13.2427,13.2051 13.7697,13.5931 L14.8757,14.4071 L15.3107,13.1031 C16.1287,10.6491 18.4147,9.0001 20.9997,9.0001 C24.3087,9.0001 26.9997,11.6911 26.9997,15.0001 C26.9997,15.3601 26.9637,15.7361 26.8917,16.1161 L26.7287,16.9781 L27.5617,17.2531 C29.6177,17.9301 30.9997,19.8371 30.9997,22.0001 C30.9997,24.7571 28.7567,27.0001 25.9997,27.0001 L23.9997,27.0001 L23.9997,29.0001 L25.9997,29.0001 C29.8597,29.0001 32.9997,25.8591 32.9997,22.0001 C32.9997,19.2551 31.4107,16.8041 28.9707,15.6641"></path>
                </g>
              </svg>
            </button>
          </div>
          <div class="menu top-menu-menu">
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon rename"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <path
                  d="M11.1667 19L14.0837 9 14.2497 9 17.1667 19 11.1667 19zM15.7497 7L12.5837 7 6.7497 27 4.9997 27 4.9997 29 9.9997 29 9.9997 27 8.8337 27 10.5837 21 17.7497 21 19.4997 27 17.9997 27 17.9997 29 22.9997 29 22.9997 27 21.5837 27 15.7497 7zM31 7L31 5C29.8 5 28.734 5.542 28 6.382 27.266 5.542 26.2 5 25 5L25 7C26.103 7 27 7.897 27 9L27 27C27 28.103 26.103 29 25 29L25 31C26.2 31 27.266 30.458 28 29.618 28.734 30.458 29.8 31 31 31L31 29C29.897 29 29 28.103 29 27L29 9C29 7.897 29.897 7 31 7"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon semaphore"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M18 11C17.449 11 17 10.552 17 10 17 9.448 17.449 9 18 9 18.551 9 19 9.448 19 10 19 10.552 18.551 11 18 11M18 7C16.346 7 15 8.346 15 10 15 11.654 16.346 13 18 13 19.654 13 21 11.654 21 10 21 8.346 19.654 7 18 7M18 19C17.449 19 17 18.552 17 18 17 17.448 17.449 17 18 17 18.551 17 19 17.448 19 18 19 18.552 18.551 19 18 19M18 15C16.346 15 15 16.346 15 18 15 19.654 16.346 21 18 21 19.654 21 21 19.654 21 18 21 16.346 19.654 15 18 15"></path>
                  <path d="M23,22 C23,22.552 22.551,23 22,23 L14,23 C13.449,23 13,22.552 13,22 L13,6 C13,5.448 13.449,5 14,5 L22,5 C22.551,5 23,5.448 23,6 L23,22 Z M27,11 L27,9 L25,9 L25,6 C25,4.346 23.654,3 22,3 L14,3 C12.346,3 11,4.346 11,6 L11,9 L9,9 L9,11 L11,11 L11,17 L9,17 L9,19 L11,19 L11,22 C11,23.654 12.346,25 14,25 L17,25 L17,31 L13,31 L13,33 L23,33 L23,31 L19,31 L19,25 L22,25 C23.654,25 25,23.654 25,22 L25,19 L27,19 L27,17 L25,17 L25,11 L27,11 Z"></path>
                </g>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon tag"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M19.0596,7 C18.7926,7 18.5416,7.104 18.3536,7.292 L6.9346,18.691 C6.7446,18.881 6.6406,19.134 6.6416,19.403 C6.6426,19.672 6.7496,19.925 6.9416,20.113 L15.6346,28.626 C16.0126,28.996 16.6616,28.995 17.0356,28.624 L28.7016,17.143 C28.8916,16.956 28.9996,16.696 28.9996,16.43 L28.9996,8 C28.9996,7.448 28.5516,7 27.9996,7 L19.0596,7 Z M16.3336,30.911 C15.5446,30.911 14.7996,30.607 14.2356,30.056 L5.5426,21.542 C4.9656,20.977 4.6456,20.22 4.6416,19.412 C4.6386,18.604 4.9506,17.846 5.5216,17.275 L16.9396,5.877 C17.5056,5.312 18.2586,5 19.0596,5 L27.9996,5 C29.6546,5 30.9996,6.346 30.9996,8 L30.9996,16.43 C30.9996,17.229 30.6736,18.008 30.1046,18.568 L18.4386,30.05 C17.8736,30.605 17.1266,30.911 16.3336,30.911 L16.3336,30.911 Z"></path>
                  <path d="M24,11 C23.449,11 23,11.448 23,12 C23,12.552 23.449,13 24,13 C24.551,13 25,12.552 25,12 C25,11.448 24.551,11 24,11 M24,15 C22.346,15 21,13.654 21,12 C21,10.346 22.346,9 24,9 C25.654,9 27,10.346 27,12 C27,13.654 25.654,15 24,15"></path>
                </g>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon properties"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M14 11L29 11 29 9 14 9zM14 19L29 19 29 17 14 17zM14 27L29 27 29 25 14 25zM8 20.414L5.293 17.707 6.707 16.293 8 17.586 11.293 14.293 12.707 15.707zM8 12.414L5.293 9.707 6.707 8.293 8 9.586 11.293 6.293 12.707 7.707zM8 28.414L5.293 25.707 6.707 24.293 8 25.586 11.293 22.293 12.707 23.707z"></path>
                </g>
              </svg>
            </button>
          </div>
          <div class="menu top-menu-menu">
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon cut"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <path
                  fill-rule="evenodd"
                  d="M26,29 C24.346,29 23,27.654 23,26 C23,24.346 24.346,23 26,23 C27.654,23 29,24.346 29,26 C29,27.654 27.654,29 26,29 M10,29 C8.346,29 7,27.654 7,26 C7,24.346 8.346,23 10,23 C11.654,23 13,24.346 13,26 C13,27.654 11.654,29 10,29 M26,21 C24.983,21 24.038,21.309 23.247,21.833 L19.414,18 L29.707,7.707 L28.293,6.293 L18,16.586 L7.707,6.293 L6.293,7.707 L16.586,18 L12.753,21.833 C11.962,21.309 11.017,21 10,21 C7.243,21 5,23.243 5,26 C5,28.757 7.243,31 10,31 C12.757,31 15,28.757 15,26 C15,24.983 14.691,24.038 14.167,23.247 L18,19.414 L21.833,23.247 C21.309,24.038 21,24.983 21,26 C21,28.757 23.243,31 26,31 C28.757,31 31,28.757 31,26 C31,23.243 28.757,21 26,21"
                ></path>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon copy"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M14.9997,3.0003 L14.9997,7.0003 L17.0007,7.0003 L17.0007,5.0003 L24.9997,5.0003 L24.9997,11.0003 L30.9997,11.0003 L30.9997,25.0003 L24.9997,25.0003 L24.9997,26.9993 L32.9997,26.9993 L32.9997,9.5853 L26.4147,3.0003 L14.9997,3.0003 Z M27.0007,6.4143 L29.5857,8.9993 L27.0007,8.9993 L27.0007,6.4143 Z"></path>
                  <path d="M4.9998,8.9997 L4.9998,32.9997 L22.9998,32.9997 L22.9998,15.5857 L16.4148,8.9997 L4.9998,8.9997 Z M6.9998,11.0007 L14.9998,11.0007 L14.9998,16.9997 L20.9998,16.9997 L20.9998,31.0007 L6.9998,31.0007 L6.9998,11.0007 Z M17.0008,12.4147 L19.5858,14.9997 L17.0008,14.9997 L17.0008,12.4147 Z"></path>
                </g>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon paste"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M25 7L25 9 27.001 9 27.001 31 9.001 31 9.001 9 11.001 9 11.001 7 7 7 7 33 29.001 33 29.001 7z"></path>
                  <path d="M21,9 L15,9 L15,7 L17,7 L17,6 C17,5.448 17.448,5 18,5 C18.552,5 19,5.448 19,6 L19,7 L21,7 L21,9 Z M23,5 L20.829,5 C20.416,3.836 19.304,3 18,3 C16.696,3 15.584,3.836 15.171,5 L13,5 L13,11 L23,11 L23,5 Z"></path>
                </g>
              </svg>
            </button>
            <button class="ui button disabled icon item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon delete"
                style={{ height: '24px', width: 'auto', fill: 'grey' }}
              >
                <g fill-rule="evenodd">
                  <path d="M27,30 C27,30.552 26.551,31 26,31 L12,31 C11.449,31 11,30.552 11,30 L11,9 L27,9 L27,30 Z M19,5 C20.103,5 21,5.897 21,7 L17,7 C17,5.897 17.897,5 19,5 L19,5 Z M31,7 L23,7 C23,4.794 21.206,3 19,3 C16.794,3 15,4.794 15,7 L7,7 L7,9 L9,9 L9,30 C9,31.654 10.346,33 12,33 L26,33 C27.654,33 29,31.654 29,30 L29,9 L31,9 L31,7 Z"></path>
                  <path d="M15 28L17 28 17 12 15 12zM21 28L23 28 23 12 21 12z"></path>
                </g>
              </svg>
            </button>
          </div>
          <div class="right menu top-menu-searchbox">
            <div class="ui right aligned category search item">
              <div class="ui small transparent input">
                <input placeholder="Filter…" type="text" value="" />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                class="icon zoom"
                style={{
                  height: '30px',
                  width: 'auto',
                  fill: 'rgb(0, 126, 177)',
                }}
              >
                <path
                  fill-rule="evenodd"
                  d="M7,16 C7,11.038 11.037,7 16,7 C20.963,7 25,11.038 25,16 C25,20.962 20.963,25 16,25 C11.037,25 7,20.962 7,16 L7,16 Z M32.707,31.293 L24.448,23.034 C26.039,21.125 27,18.673 27,16 C27,9.935 22.065,5 16,5 C9.935,5 5,9.935 5,16 C5,22.065 9.935,27 16,27 C18.673,27 21.125,26.039 23.034,24.448 L31.293,32.707 L32.707,31.293 Z"
                ></path>
              </svg>
              <div class="results"></div>
            </div>
          </div>
        </div>
        <Segment secondary attached className="fieldset-structure">
          <Breadcrumbs pathname={this.props.pathname} />
        </Segment>
        <Table selectable compact singleLine attached>
          <Table.Header className="hide-not-full-size">
            <Table.Row>
              <Table.HeaderCell>
                <Dropdown
                  item
                  upward={false}
                  className="sort-icon"
                  aria-label={this.props.intl.formatMessage(messages.sort)}
                  icon={
                    <Icon
                      name={configurationSVG}
                      size="24px"
                      color="#826a6a"
                      className="configuration-svg"
                    />
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Header
                      content={this.props.intl.formatMessage(
                        messages.rearrangeBy,
                      )}
                    />
                    {map(
                      [
                        'id',
                        'sortable_title',
                        'EffectiveDate',
                        'CreationDate',
                        'ModificationDate',
                        'portal_type',
                      ],
                      (index) => (
                        <Dropdown.Item
                          key={index}
                          className={`sort_${index} icon-align`}
                        >
                          <Icon name={downKeySVG} size="24px" />
                          <FormattedMessage id={Indexes[index].label} />
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={this.onSortItems}
                              value={`${Indexes[index].sort_on}|ascending`}
                              className={`sort_${Indexes[index].sort_on}_ascending icon-align`}
                            >
                              <Icon name={sortDownSVG} size="24px" />{' '}
                              <FormattedMessage
                                id="Ascending"
                                defaultMessage="Ascending"
                              />
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={this.onSortItems}
                              value={`${Indexes[index].sort_on}|descending`}
                              className={`sort_${Indexes[index].sort_on}_descending icon-align`}
                            >
                              <Icon name={sortUpSVG} size="24px" />{' '}
                              <FormattedMessage
                                id="Descending"
                                defaultMessage="Descending"
                              />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Item>
                      ),
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Dropdown
                  upward={false}
                  trigger={
                    <Icon
                      name={checkboxUncheckedSVG}
                      color={'#826a6a'}
                      size="24px"
                    />
                  }
                  icon={null}
                >
                  <Dropdown.Menu>
                    <Dropdown.Header
                      content={this.props.intl.formatMessage(messages.select)}
                    />
                    <Dropdown.Item onClick={this.onSelectAll}>
                      <Icon
                        name={checkboxCheckedSVG}
                        color="#007eb1"
                        size="24px"
                      />{' '}
                      <FormattedMessage id="All" defaultMessage="All" />
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.onSelectNone}>
                      <Icon name={checkboxUncheckedSVG} size="24px" />{' '}
                      <FormattedMessage id="None" defaultMessage="None" />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Header
                      content={this.props.intl.formatMessage(
                        messages.selected,
                        { count: 0 },
                      )}
                    />
                    <Input
                      icon={<Icon name={zoomSVG} size="24px" />}
                      iconPosition="left"
                      className="search"
                      placeholder={this.props.intl.formatMessage(
                        messages.filter,
                      )}
                      onChange={this.onChangeSelected}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                    <Dropdown.Menu scrolling>
                      {map([], (item) => (
                        <Dropdown.Item
                          key={item}
                          value={item}
                          onClick={this.onDeselect}
                        >
                          <Icon name={deleteSVG} color="#e40166" size="24px" />{' '}
                          {this.getFieldById(item, 'title')}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="Title" defaultMessage="Title" />
              </Table.HeaderCell>
              <Table.HeaderCell>Review State</Table.HeaderCell>
              <Table.HeaderCell>Last Modified</Table.HeaderCell>
              <Table.HeaderCell>Publication Date</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">
                <FormattedMessage id="Actions" defaultMessage="Actions" />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.items.map((item, index, items) => [
              <Table.Row>
                <Table.Cell className="hide-not-full-size">
                  <Button icon basic>
                    <Icon
                      name={dragSVG}
                      size="20px"
                      color="#878f93"
                      className="content drag handle"
                    />
                  </Button>
                </Table.Cell>
                <Table.Cell className="hide-not-full-size">
                  <Button icon basic aria-label="Checked">
                    <Icon
                      name={checkboxUncheckedSVG}
                      color="#826a6a"
                      size="24px"
                      className="unchecked"
                    />
                  </Button>
                </Table.Cell>
                <Table.Cell style={{ width: '600px' }}>
                  <Link
                    key={item.url}
                    to={item.url}
                    className="icon-align-name"
                  >
                    <div className="expire-align" style={{ paddingLeft: 4 }}>
                      <Icon
                        name={getContentIcon(item['@type'], item.is_folderish)}
                        size="20px"
                        className="icon-margin"
                        color="#878f93"
                        title={item['@type']}
                      />{' '}
                      <span title={item.title}>{item.title}</span>
                    </div>
                  </Link>
                </Table.Cell>
                <Table.Cell className="hide-not-full-size">
                  <div>
                    <span>
                      <Circle color={getColor(item.review_state)} size="15px" />
                    </span>
                    {messages[item.review_state]
                      ? this.props.intl.formatMessage(
                          messages[item.review_state],
                        )
                      : item['review_title'] ||
                        item['review_state'] ||
                        this.props.intl.formatMessage(
                          messages.no_workflow_state,
                        )}
                  </div>
                </Table.Cell>
                <Table.Cell className="hide-not-full-size">
                  <>
                    {item.modified !== 'None' ? (
                      <FormattedDate date={item.modified} />
                    ) : (
                      this.props.intl.formatMessage(messages.none)
                    )}
                  </>
                </Table.Cell>
                <Table.Cell className="hide-not-full-size">
                  <>
                    {item.created !== 'None' ? (
                      <FormattedDate date={item.created} />
                    ) : (
                      this.props.intl.formatMessage(messages.none)
                    )}
                  </>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Dropdown
                    className="row-actions"
                    icon={<Icon name={moreSVG} size="24px" color="#007eb1" />}
                  >
                    <Dropdown.Menu className="left">
                      <Link
                        className="item icon-align"
                        to={`${item['@id']}/edit`}
                      >
                        <Icon name={editingSVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage id="Edit" defaultMessage="Edit" />
                      </Link>
                      <Link
                        className="item right-dropdown icon-align"
                        to={item['@id']}
                      >
                        <Icon name={showSVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage id="View" defaultMessage="View" />
                      </Link>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        value={item['@id']}
                        className="right-dropdown icon-align"
                      >
                        <Icon name={cutSVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage id="Cut" defaultMessage="Cut" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        value={item['@id']}
                        className="right-dropdown icon-align"
                      >
                        <Icon name={copySVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage id="Copy" defaultMessage="Copy" />
                      </Dropdown.Item>
                      <Dropdown.Item
                        value={item['@id']}
                        className="right-dropdown icon-align"
                      >
                        <Icon name={deleteSVG} color="#e40166" size="24px" />{' '}
                        <FormattedMessage id="Delete" defaultMessage="Delete" />
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        value={'order'}
                        className="right-dropdown icon-align"
                      >
                        <Icon name={moveUpSVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage
                          id="Move to top of folder"
                          defaultMessage="Move to top of folder"
                        />
                      </Dropdown.Item>
                      <Dropdown.Item
                        value={'order'}
                        className="right-dropdown icon-align"
                      >
                        <Icon name={moveDownSVG} color="#007eb1" size="24px" />{' '}
                        <FormattedMessage
                          id="Move to bottom of folder"
                          defaultMessage="Move to bottom of folder"
                        />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>,
            ])}
            {this.props.items.length === 0 && (
              <Table.Row>
                <Table.Cell>
                  <center>
                    <em>No items found</em>
                  </center>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <div className="contents-pagination hide-not-full-size">
          <Pagination
            current={0}
            total={1}
            pageSize={50}
            pageSizes={[50, this.props.intl.formatMessage(messages.all)]}
            onChangePage={() => {}}
            onChangePageSize={() => {}}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      items: state.content.data.items || [],
      pathname: state.router.location.pathname,
    }),
    {},
  ),
)(StructureComponent);
