import { type SchemaDefinition } from "redis-om";

export type ExtendedSchemaDefinition = SchemaDefinition &
  Record<string, { properties?: ExtendedSchemaDefinition; isArray?: boolean }>;

export type RedisInferSchema<T extends ExtendedSchemaDefinition> = {
  [Key in keyof T]: T[Key] extends { properties: ExtendedSchemaDefinition }
    ? T[Key] extends { isArray: true }
      ? Array<RedisInferSchema<T[Key]["properties"]>>
      : RedisInferSchema<T[Key]["properties"]>
    : T[Key]["type"] extends keyof InferSchemaMapping
    ? InferSchemaMapping[T[Key]["type"]]
    : unknown;
};

type Point = {
  longitude: number;
  latitude: number;
};

type InferSchemaMapping = {
  string: string;
  number: number;
  boolean: boolean;
  "string[]": string[];
  "number[]": number[];
  date: Date;
  point: Point;
  text: string;
};
