import React from 'react';
import { NavLink } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import config from '@plone/volto/registry';

import rightKey from '@plone/volto/icons/right-key.svg';

const NavItem = ({ item, lang }) => {
  const { settings } = config;
  return (
    <List.Item>
      <i className="icon">
        <Icon name={rightKey} size="12px" />
      </i>
      <List.Content>
        <NavLink
          to={item.url === '' ? '/' : item.url}
          key={item.url}
          exact={
            settings.isMultilingual ? item.url === `/${lang}` : item.url === ''
          }
        >
          {item.title}
        </NavLink>
      </List.Content>
    </List.Item>
  );
};

export default NavItem;
