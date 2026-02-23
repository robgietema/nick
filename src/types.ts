import express from 'express';
import { Knex } from 'knex';

export type JsonPrimative = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;

export interface Model {
  toJson: (req: Request) => any;
  getVocabulary: (req: Request) => any;
}

export interface User extends Model {
  id: string;
  fullname: string;
  tokens: string[];
  update: (data: any, trx: Knex.Transaction) => Promise<void>;
  _groups: string[];
  getRoles: () => string[];
  fetchUserGroupRolesByDocument: (uuid: string) => Promise<void>;
}

export interface Request extends express.Request {
  permissions: string[];
  apiPath: string;
  document: any;
  documentPath: string;
  i18n: (key: string, params?: any) => string;
  indexes: {
    models: any[];
  };
  user: User;
  navroot: any;
  type: any;
  token?: string;
  timestamp: string;
  params: { [key: string]: any };
  query: { [key: string]: string };
}

export interface Fieldset {
  id: string;
  title: string;
  behavior?: string;
  fields: string[];
}

export interface Property {
  title: string;
  description: string;
  behavior?: string;
  [key: string]: any;
}

export interface Schema {
  behavior?: string;
  fieldsets: Fieldset[];
  properties?: { [key: string]: Property };
  required?: string[];
  behaviors?: string[];
  layouts?: string[];
}

export interface VocabularyTerm {
  title: string;
  token: string;
}

export interface Route {
  view: string;
  op: 'get' | 'post' | 'put' | 'delete' | 'patch';
  permission: string;
  middleware?: any;
  handler?: any;
}
