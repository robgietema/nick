import express from 'express';

export type JsonPrimative = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;

export interface Model {
  toJSON: (req: Request) => any;
  getVocabulary: (req: Request) => any;
}

export interface Request extends express.Request {
 permissions: string[];
  apiPath: string;
  document: {
    path: string;
  };
  documentPath: string;
  i18n: (key: string) => string;
  type: {
    filter_content_types: boolean;
    allowed_content_types: string[];
  };
  user: {
    id: string;
  };
}