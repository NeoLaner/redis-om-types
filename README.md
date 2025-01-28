# redis-om-types

[![npm version](https://badge.fury.io/js/redis-om-types.svg)](https://badge.fury.io/js/redis-om-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript type definitions and utilities for Redis OM (Object Mapping), providing type-safe interactions with Redis.

## Features

- Type-safe schema definitions
- Automatic type inference for Redis entities

## Installation

```bash
npm install redis-om-types --save-dev
```

## Usage

Import the ExtendedSchemaDefinition, RedisInferSchema types and use it in your TypeScript project:

```typescript
import { ExtendedSchemaDefinition, RedisInferSchema } from "redis-om-types";
import { getRedisClient } from "@/lib/db";
import { Repository, Schema } from "redis-om";

const redis = await getRedisClient();

const artistsSchemaDefinition = {
  id: { type: "string" },
  name: { type: "text", sortable: true },
  age: { type: "number" },
  city: { type: "text" },
  services: {
    type: "string[]",
    isArray: true,
    path: "artists.services[*]",
    properties: {
      id: { type: "string" },
      name: { type: "text" },
      price: { type: "number" },
      category_id: { type: "string" },
      options: {
        type: "string[]",
        isArray: true,
        properties: {
          name: { type: "text" },
          price: { type: "number" },
        },
      },
    },
  },
} as const satisfies ExtendedSchemaDefinition;

export const artistsSchema = new Schema<
  RedisInferSchema<typeof artistsSchemaDefinition>
>("models.Artists", artistsSchemaDefinition);

export const artistsRepository = new Repository(artistsSchema, redis);
```

```typescript
export async function getArtists() {
  const artists = await artistsRepository.search().return.all();
  console.log(artists[0]?.services[0]?.options[0]); // {name , value};
  return artists;
}
```

**isArray** and **properties** added in ExtendedSchemaDefinition

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [Redis OM](https://github.com/redis/redis-om-node)
- [Redis](https://redis.io/)
