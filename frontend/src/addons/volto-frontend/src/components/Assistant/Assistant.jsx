import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Form, Input, Radio } from 'semantic-ui-react';
import { last, map, remove } from 'lodash';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import copySVG from '@plone/volto/icons/copy.svg';
import headingSVG from '@plone/volto/icons/heading.svg';
import subheadingSVG from '@plone/volto/icons/subheading.svg';
import textSVG from '@plone/volto/icons/paragraph.svg';
import reloadSVG from '@plone/volto/icons/reload.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';

import { generate } from '../../actions/generate/generate';
import { setFormData } from '@plone/volto/actions/form/form';
import { addBlock, changeBlock } from '@plone/volto/helpers/Blocks/Blocks';

const Assistant = (props) => {
  const dispatch = useDispatch();
  const response = useSelector((state) => state.generate.response);
  const loading = useSelector((state) => state.generate.loading);
  const loaded = useSelector((state) => state.generate.loaded);
  const formData = useSelector((state) => state.form?.global);
  const prevloading = usePrevious(loading);

  const setTitle = (value) => {
    dispatch(setFormData({ ...formData, title: value }));
  };

  const setDescription = (value) => {
    dispatch(setFormData({ ...formData, description: value }));
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
  const [contextSelection, setContextSelection] = useState('page');
  const [queries, setQueries] = useState([]);

  const scrollToLastQuery = () => {
    window.setTimeout(() => {
      last(document.getElementsByClassName('assistant-query')).scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  const sendQuery = (value) => {
    setQueries([...queries, { prompt: value, response: [] }]);
    let context = '';
    if (contextSelection === 'page') {
      context = map(formData.blocks, (block) =>
        block['@type'] === 'slate' ? block.plaintext : '',
      ).join(' ');
    }
    dispatch(generate(value, context));
    scrollToLastQuery();
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

  useEffect(() => {
    const newQueries = [...queries];

    // If new response is loaded
    if (prevloading && loaded) {
      newQueries[queries.length - 1].response = response
        .replaceAll('**', '')
        .split('\n\n');
      setQueries(newQueries);
      scrollToLastQuery();
    }
  }, [prevloading, loaded]);

  return (
    <div className="assistant">
      <div className="assistant-response">
        {queries.map((query, index) => (
          <div className="assistant-query" key={index}>
            <div className="assistant-prompt">
              {query.prompt}{' '}
              {(index < queries.length - 1 || !loading) && (
                <>
                  <Button
                    basic
                    onClick={() => {
                      sendQuery(query.prompt);
                    }}
                    icon={
                      <Icon
                        name={reloadSVG}
                        size={16}
                        title="Resend this prompt"
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
                        size={16}
                        title="Delete this prompt"
                      />
                    }
                  />
                </>
              )}
            </div>
            {query.response.length > 0 ? (
              <div className="assistant-res">
                {map(query.response, (paragraph) => renderParagraph(paragraph))}
              </div>
            ) : (
              loading && <div className="dot-elastic"></div>
            )}
          </div>
        ))}
      </div>
      <div className="assistant-footer">
        <Form>
          <div className="assistant-context">
            <span className="label">Context: </span>
            <Radio
              label="Page"
              name="radioGroup"
              value="this"
              checked={contextSelection === 'page'}
              onChange={() => setContextSelection('page')}
            />
            <Radio
              label="Site"
              name="radioGroup"
              value="this"
              checked={contextSelection === 'site'}
              onChange={() => setContextSelection('site')}
            />
          </div>
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
