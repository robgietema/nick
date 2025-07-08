import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Form, Input } from 'semantic-ui-react';
import cx from 'classnames';
import { compact, last, map, keys, trim } from 'lodash';
import { toast } from 'react-toastify';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import copySVG from '@plone/volto/icons/copy.svg';
import headingSVG from '@plone/volto/icons/heading.svg';
import subheadingSVG from '@plone/volto/icons/subheading.svg';
import textSVG from '@plone/volto/icons/paragraph.svg';
import reloadSVG from '@plone/volto/icons/reload.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import pageSVG from '@plone/volto/icons/page.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import halfstarSVG from '@plone/volto/icons/half-star.svg';
import commentSVG from '@plone/volto/icons/comment.svg';
import navSVG from '@plone/volto/icons/nav.svg';
import microphoneSVG from '@plone/volto/icons/microphone.svg';
import microphoneOffSVG from '@plone/volto/icons/microphone-off.svg';
import attachmentSVG from '@plone/volto/icons/attachment.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';

import { setFormData } from '@plone/volto/actions/form/form';
import { addBlock, changeBlock } from '@plone/volto/helpers/Blocks/Blocks';

import config from '@plone/volto/registry';

const Assistant = (props) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [speechListening, setSpeechListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [inputValue, setInputValue] = useState('');

  // Select context
  const [contextPage, setContextPage] = useState(true);
  const [contextSite, setContextSite] = useState(true);
  const [contextAttachment, setContextAttachment] = useState(true);
  const [contextAttachmentContent, setContextAttachmentContent] =
    useState(undefined);
  const [queries, setQueries] = useState([]);
  const [currentQuery, setCurrentQuery] = useState(false);

  const formData = useSelector((state) => state.form?.global);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setSpeechSupported(false);
      return;
    }

    // Initialize SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    const handleStart = () => {
      setSpeechListening(true);
      setInputValue('');
    };

    const handleEnd = () => {
      setSpeechListening(false);
      setInputValue('');
    };

    const handleError = (event) => {
      toast.error(
        <Toast
          error
          title="Error"
          content={`Speech recognition error ${event.error}`}
        />,
      );
    };

    const handleResult = (event) => {
      let currentInterimTranscript = '';
      let newFinalTranscript = '';

      // Process results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          newFinalTranscript += transcriptText + ' ';
        } else {
          currentInterimTranscript += transcriptText;
        }
      }

      if (trim(newFinalTranscript) !== '') {
        sendQuery(newFinalTranscript);
      }

      // Update interim transcript
      setInputValue(currentInterimTranscript);
    };

    // Attach event listeners
    recognitionRef.current.onstart = handleStart;
    recognitionRef.current.onend = handleEnd;
    recognitionRef.current.onerror = handleError;
    recognitionRef.current.onresult = handleResult;

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      }
    };
  }, [setSpeechSupported, setSpeechListening, setInputValue]);

  const toggleListening = async () => {
    if (!speechSupported) {
      toast.error(
        <Toast
          error
          title="Error"
          content={'Speech recognition is not supported in your browser.'}
        />,
      );
      return;
    }

    if (speechListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current?.start();
      } catch (error) {
        toast.error(
          <Toast
            error
            title="Error"
            content={'Microphone access is required for speech recognition.'}
          />,
        );
      }
    }
  };

  const toggleShow = () => {
    if (!show) {
      window.setTimeout(() => {
        document.querySelector('.assistant-input input').focus();
      }, 10);
    }
    setShow(!show);
  };

  const tools = {
    'set title': {
      spec: {
        type: 'function',
        function: {
          name: 'set title',
          description: 'Sets the title',
          parameters: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'The title to be set',
              },
            },
            required: ['title'],
          },
        },
      },
      handler: ({ title }) => setTitle(title),
      message: ({ title }) => `The title is set to "${title}".`,
    },
    'save page': {
      spec: {
        type: 'function',
        function: {
          name: 'save page',
          description: 'Save the page',
        },
      },
      handler: () => {
        document.getElementById('toolbar-save').click();
      },
      message: () => `The page is saved.`,
    },
    'edit page': {
      spec: {
        type: 'function',
        function: {
          name: 'edit page',
          description: 'Edit the page',
        },
      },
      handler: () => {
        document.querySelector('.toolbar-actions .edit').click();
      },
      message: () => `Editing the page.`,
    },
    cancel: {
      spec: {
        type: 'function',
        function: {
          name: 'cancel',
          description: 'Cancel',
        },
      },
      handler: () => {
        document.querySelector('.toolbar-actions .cancel').click();
      },
      message: () => `Cancelled editing the page.`,
    },
  };

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
    fetch(`${config.settings.devProxyToApiPath}/@chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: value,
        params,
        messages,
        tools: map(keys(tools), (tool) => tools[tool].spec),
        stream: true,
      }),
    }).then(async (response) => {
      const reader = response.body?.getReader();
      let readResult;
      readResult = await reader.read();
      while (!readResult.done) {
        const tokens = JSON.parse(
          `[${compact(new TextDecoder().decode(readResult.value).split('\n')).join(',')}]`,
        );
        readResult = await reader.read();
        map(tokens, (token) => {
          raw += token.message.content;
          if (token.message.tool_calls) {
            map(token.message.tool_calls, (tool) => {
              raw += tools[tool.function.name].message(tool.function.arguments);
              tools[tool.function.name].handler(tool.function.arguments);
            });
          }
          const newCurrentQuery = {
            response: raw.replaceAll('**', '').split('\n\n'),
            prompt: value,
          };
          if (token.done) {
            setMessages([
              ...messages,
              { role: 'user', content: newCurrentQuery.prompt },
              {
                role: 'assistant',
                content: newCurrentQuery.response.join('\n'),
              },
            ]);
            setQueries((prevQueries) => [
              ...prevQueries,
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
    <div className="assistant-wrapper">
      <div className="assistant-button">
        <Icon
          name={commentSVG}
          size="36px"
          className="circled"
          title="Assistant"
          onClick={toggleShow}
        />
      </div>
      <div className={cx('assistant', { show: show })}>
        <div className="assistant-header">
          <Icon
            className="star"
            name={halfstarSVG}
            size="20px"
            title="Virtual Assistant"
          />
          Virtual Assistant
          <Icon
            className="close"
            name={clearSVG}
            size="20px"
            title="Close"
            onClick={() => setShow(false)}
          />
        </div>
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
                      contextPage
                        ? 'Disable page context'
                        : 'Enable page context'
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
                      contextPage
                        ? 'Disable site context'
                        : 'Enable site context'
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendQuery(e.target.value);
                  setInputValue('');
                }
              }}
            >
              <input />
              <Icon
                size={24}
                name={speechListening ? microphoneSVG : microphoneOffSVG}
                onClick={toggleListening}
                className={speechListening ? 'listening' : ''}
              />
            </Input>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
