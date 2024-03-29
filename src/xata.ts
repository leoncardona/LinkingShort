// Generated by Xata Codegen 0.29.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "url",
    columns: [
      {
        name: "full",
        type: "string",
        notNull: true,
        defaultValue: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      { name: "shorten", type: "string", notNull: true, defaultValue: "rick" },
    ],
  },
  {
    name: "user",
    columns: [
      {
        name: "email",
        type: "text",
        notNull: true,
        defaultValue: "example@example.com",
      },
      { name: "password", type: "text" },
      { name: "username", type: "string", notNull: true, defaultValue: "user" },
      { name: "urls", type: "multiple" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Url = InferredTypes["url"];
export type UrlRecord = Url & XataRecord;

export type User = InferredTypes["user"];
export type UserRecord = User & XataRecord;

export type DatabaseSchema = {
  url: UrlRecord;
  user: UserRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Noel-Le-n-s-workspace-s6bo6v.eu-central-1.xata.sh/db/LinkingShort",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
