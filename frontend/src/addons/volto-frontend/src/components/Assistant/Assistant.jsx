import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Form, Input } from 'semantic-ui-react';
import { compact, last, map } from 'lodash';

import Icon from '@plone/volto/components/theme/Icon/Icon';

import copySVG from '@plone/volto/icons/copy.svg';
import headingSVG from '@plone/volto/icons/heading.svg';
import subheadingSVG from '@plone/volto/icons/subheading.svg';
import textSVG from '@plone/volto/icons/paragraph.svg';
import reloadSVG from '@plone/volto/icons/reload.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import pageSVG from '@plone/volto/icons/page.svg';
import navSVG from '@plone/volto/icons/nav.svg';
import attachmentSVG from '@plone/volto/icons/attachment.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';

import { setFormData } from '@plone/volto/actions/form/form';
import { addBlock, changeBlock } from '@plone/volto/helpers/Blocks/Blocks';

import config from '@plone/volto/registry';

const Assistant = (props) => {
  const dispatch = useDispatch();
  const [lastContext, setLastContext] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const formData = useSelector((state) => state.form?.global);

  const setTitle = (value) => {
    dispatch(setFormData({ ...formData, title: value }));
  };

  const setDescription = (value) => {
    dispatch(setFormData({ ...formData, description: value }));
  };

  const insertBlocks = (values) => {
    let newFormData = formData;
    map(values, (value) => {
      let [blockId, addFormData] = addBlock(newFormData, 'slate', -1);
      newFormData = changeBlock(addFormData, blockId, {
        '@type': 'slate',
        plaintext: value,
        value: [
          {
            type: 'p',
            children: [
              {
                text: value,
              },
            ],
          },
        ],
      });
    });

    dispatch(setFormData(newFormData));
  };

  const insertBlock = (value) => {
    let [blockId, newFormData] = addBlock(formData, 'slate', -1);
    newFormData = changeBlock(newFormData, blockId, {
      '@type': 'slate',
      plaintext: value,
      value: [
        {
          type: 'p',
          children: [
            {
              text: value,
            },
          ],
        },
      ],
    });

    dispatch(setFormData(newFormData));
  };

  // Select context
  const [contextPage, setContextPage] = useState(true);
  const [contextSite, setContextSite] = useState(true);
  const [contextAttachment, setContextAttachment] = useState(true);
  const [contextAttachmentContent, setContextAttachmentContent] =
    useState(undefined);
  const [queries, setQueries] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(false);

  const scrollToLastQuery = () => {
    window.setTimeout(() => {
      last(
        document.getElementsByClassName('assistant-query-footer'),
      ).scrollIntoView({
        behavior: 'instant',
      });
    }, 100);
  };

  const sendQuery = (value) => {
    setCurrentQuery({ prompt: value, raw: '', response: [] });
    setLoading(true);
    scrollToLastQuery();
    let raw = '';
    let params = {};
    if (contextPage) {
      let page = '';
      page = map(formData.blocks, (block) =>
        block['@type'] === 'slate' ? block.plaintext : '',
      ).join(' ');
      params.Page = page;
    }
    if (contextSite) {
      params.Site = 'enable';
    }
    if (contextAttachment && contextAttachmentContent) {
      params.Attachment = contextAttachmentContent.data;
    }
    fetch(`${config.settings.devProxyToApiPath}/@generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: lastContext,
        prompt: value,
        params,
        stream: true,
      }),
    }).then(async (response) => {
      const reader = response.body?.getReader();
      let readResult;
      readResult = await reader.read();
      while (!readResult.done) {
        console.log(new TextDecoder().decode(readResult.value));
        const tokens = JSON.parse(
          `[${compact(new TextDecoder().decode(readResult.value).split('\n')).join(',')}]`,
        );
        readResult = await reader.read();
        map(tokens, (token) => {
          raw += token.response;
          const newCurrentQuery = {
            response: raw.replaceAll('**', '').split('\n\n'),
            prompt: value,
          };
          if (token.done) {
            setLastContext(token.context);
            setQueries([
              ...queries,
              {
                prompt: newCurrentQuery.prompt,
                response: newCurrentQuery.response,
              },
            ]);
            setCurrentQuery(undefined);
            setLoading(false);
          } else {
            setCurrentQuery(newCurrentQuery);
          }
          scrollToLastQuery();
        });
      }
    });
  };

  const deleteQuery = (index) => {
    let newQueries = [...queries];
    newQueries.splice(index, 1);
    setQueries(newQueries);
  };

  const stripQuotes = (str) => {
    // Remove leading and trailing quotes
    return str.replace(/^['"]|['"]$/g, '');
  };

  const Toolbar = ({ value }) => (
    <div className="assistant-toolbar">
      <ButtonGroup>
        <Button
          as="a"
          compact
          size="tiny"
          icon={<Icon name={copySVG} size="24px" title="Copy to clipboard" />}
          onClick={() => navigator.clipboard.writeText(stripQuotes(value))}
        />
        <Button
          as="a"
          compact
          size="tiny"
          icon={<Icon name={headingSVG} size="24px" title="Set as title" />}
          onClick={() => setTitle(stripQuotes(value))}
        />
        <Button
          as="a"
          compact
          size="tiny"
          icon={
            <Icon name={subheadingSVG} size="24px" title="Set as description" />
          }
          onClick={() => setDescription(stripQuotes(value))}
        />
        <Button
          as="a"
          compact
          size="tiny"
          icon={
            <Icon name={textSVG} size="24px" title="Insert as new text block" />
          }
          onClick={() => insertBlock(stripQuotes(value))}
        />
      </ButtonGroup>
    </div>
  );

  const onUploadAttachment = (e) => {
    let fr = new FileReader();
    fr.onload = () => {
      setContextAttachmentContent({
        filename: e.target.files[0].name,
        data: fr.result.split(',')[1], // Get base64 data
      });
    };
    fr.readAsDataURL(e.target.files[0]);
  };

  const renderParagraph = (paragraph) => {
    // If paragraph is a list
    if (paragraph.startsWith('1. ')) {
      const items = paragraph.split('\n');
      return (
        <ol>
          {items.map((item, index) => (
            <li key={index} className="assistant-block">
              <Toolbar value={item.replace(/^\d+\.\s/, '')} />
              {item.replace(/^\d+\.\s/, '')}
            </li>
          ))}
        </ol>
      );
    } else if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
      const items = paragraph.split('\n');
      return (
        <ul>
          {items.map((item, index) => (
            <li key={index} className="assistant-block">
              <Toolbar value={item.replace(/^[*-]\s/, '')} />
              {item.replace(/^[*-]\s/, '')}
            </li>
          ))}
        </ul>
      );
    } else {
      // If paragraph is a simple text
      return (
        <p className="assistant-block">
          <Toolbar value={paragraph} />
          {paragraph}
        </p>
      );
    }
  };

  return (
    <div className="assistant">
      <div className="assistant-response">
        {(currentQuery ? [...queries, currentQuery] : queries).map(
          (query, index) => (
            <div className="assistant-query" key={index}>
              <div className="assistant-prompt">
                <div className="assistant-prompt-title">
                  {query.prompt}

                  {(index < queries.length - 1 || !loading) && (
                    <Button
                      basic
                      className="reload"
                      onClick={() => {
                        sendQuery(query.prompt);
                      }}
                      icon={
                        <Icon
                          name={reloadSVG}
                          size="16px"
                          title="Resend this prompt"
                        />
                      }
                    />
                  )}
                </div>
                {(index < queries.length - 1 || !loading) && (
                  <>
                    <Button
                      basic
                      onClick={() => {
                        insertBlocks(
                          map(query.response, (paragraph) =>
                            stripQuotes(paragraph),
                          ),
                        );
                      }}
                      className="blocks"
                      icon={
                        <Icon
                          name={textSVG}
                          size="16px"
                          title="Insert all text as new blocks"
                        />
                      }
                    />
                    <Button
                      basic
                      onClick={() => {
                        deleteQuery(index);
                      }}
                      className="delete"
                      icon={
                        <Icon
                          name={deleteSVG}
                          size="16px"
                          title="Delete this prompt"
                        />
                      }
                    />
                  </>
                )}
              </div>
              {query.response.length > 0 ? (
                <div className="assistant-res">
                  {map(query.response, (paragraph) =>
                    renderParagraph(paragraph),
                  )}
                </div>
              ) : (
                loading && <div className="dot-elastic"></div>
              )}
            </div>
          ),
        )}
        <span className="assistant-query-footer"></span>
      </div>
      <div className="assistant-footer">
        <div className="assistant-context">
          <div
            className={`assistant-context-button ${contextPage ? '' : 'hide'}`}
          >
            <Icon
              name={pageSVG}
              size="16px"
              title="Page context"
              className="context-icon"
            />
            <span className="context-label">Page</span>
            <Button
              basic
              className="show-hide-button"
              onClick={() => setContextPage(!contextPage)}
              icon={
                <Icon
                  name={contextPage ? showSVG : hideSVG}
                  size="20px"
                  title={
                    contextPage ? 'Disable page context' : 'Enable page context'
                  }
                />
              }
            />
          </div>
          <div
            className={`assistant-context-button ${contextSite ? '' : 'hide'}`}
          >
            <Icon
              name={navSVG}
              size="16px"
              title="Site context"
              className="context-icon"
            />
            <span className="context-label">Site</span>
            <Button
              basic
              className="show-hide-button"
              onClick={() => setContextSite(!contextSite)}
              icon={
                <Icon
                  name={contextSite ? showSVG : hideSVG}
                  size="20px"
                  title={
                    contextPage ? 'Disable site context' : 'Enable site context'
                  }
                />
              }
            />
          </div>
          <div
            className={`assistant-context-button ${contextAttachment ? '' : 'hide'}`}
          >
            <label
              htmlFor="context-attachment-input"
              className="context-attachment-label"
            >
              <Icon
                name={attachmentSVG}
                size="20px"
                title="Enable site content"
                className="context-icon attachment"
              />
              <input
                name="context-attachment-input"
                id="context-attachment-input"
                type="file"
                onChange={onUploadAttachment}
              />
              <span className="context-label attachment">
                {contextAttachmentContent
                  ? contextAttachmentContent.filename
                  : 'Add Context...'}
              </span>
            </label>
            {contextAttachmentContent && (
              <Button
                basic
                className="show-hide-button"
                onClick={() => setContextAttachment(!contextAttachment)}
                icon={
                  <Icon
                    name={contextAttachment ? showSVG : hideSVG}
                    size="20px"
                    title={
                      contextPage
                        ? 'Disable attachment context'
                        : 'Enable attachment context'
                    }
                  />
                }
              />
            )}
          </div>
        </div>
        <Form>
          <Input
            className="assistant-input"
            loading={loading}
            type="text"
            placeholder={loading ? 'Loading...' : 'How can I help you?'}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendQuery(e.target.value);
                e.target.value = ''; // Clear input after sending
              }
            }}
          />
        </Form>
      </div>
    </div>
  );
};

export default Assistant;
