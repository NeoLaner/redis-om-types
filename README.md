# redis-om-types

A TypeScript library utils for better support types in Redis OM.

## Installation

Install the package using npm:

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
  working_hours: {
    type: "string[]",
    path: "artists.working_hours[*]",
    isArray: true,
    properties: {
      salon_id: { type: "string" },
      start: { type: "string" },
      end: { type: "string" },
      salon_name: { type: "text" },
      working_days: { type: "number[]" },
      city: { type: "text" },
    },
  },
  services: {
    type: "string[]",
    isArray: true,
    path: "artists.services[*]",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      price: { type: "number" },
      duration: { type: "number" },
      description: { type: "text" },
      options: {
        type: "string[]",
        isArray: true,
        properties: {
          name: { type: "string" },
          price: { type: "number" },
        },
      },
      category_id: { type: "string" },
    },
  },
  services_ids: { type: "string[]" },
  salons_ids: { type: "string[]" },
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

## License

This project is licensed under the MIT License.
