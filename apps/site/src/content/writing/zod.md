---
title: 'Zod: Bridging the Gap Between TypeScript and Reality'
description: 'Stop trusting API responses. Use Zod for runtime schemas, TypeScript types, and validation errors before bad data hits the UI.'
pubDate: '2026-02-03'
tags: ['typescript']
---

TypeScript types stop at the compile boundary. Zod is how I check API payloads and other untrusted data at runtime before they hit the UI.

Below: schemas, types from those schemas, and validation errors.

---

## The Problem with TypeScript Alone

TypeScript is strong during development. It cannot validate data at runtime. Unexpected API or form data still blows up in the browser.

Take a user fetch. An interface does not mean the server returns that shape:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  
  // TypeScript assumes 'data' is a 'User', but it could be anything!
  return data; 
}
```

Zod can validate that payload before you use it.

---

## Using Zod at the boundary

Define a schema, parse at the edge, then trust the result:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  // Validate at the boundary
  const parsedUser = UserSchema.parse(data);
  
  return parsedUser; // Now 'parsedUser' is guaranteed to be correct at runtime.
}
```

If the data does not match `UserSchema`, Zod throws and you handle the failure instead of shipping bad data into the UI.

---

## One Source of Truth: Generating Types

One of the best parts of Zod is that you don't need to write both a schema and an interface. You define the schema, and Zod gives you the type:

```typescript
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;
```

In this example, we define the `UserSchema` using Zod and then use `z.infer` to generate the corresponding TypeScript type `User`. This way, you only need to maintain a single source of truth for your data structure.

---

## Handling Validation Errors

When using Zod to validate data, it's important to handle validation errors gracefully. Zod provides detailed error messages that can help you understand what went wrong during validation.

```typescript
try {
  const parsedUser = UserSchema.parse(data);
  return parsedUser;
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation errors:', error.errors);
    // Handle validation errors (e.g., return a default value or show an error message)
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```
Zod provides detailed error messages when validation fails. While .parse() works, it throws an exception. For a cleaner approach, 99% of the time you’ll want to use safeParse.

```typescript
const result = UserSchema.safeParse(data);

if (result.success) {
  return result.data; // Fully typed and valid
} else {
  console.error('Validation errors:', result.error.errors);
  // Handle gracefully without crashing the app
}
```

---

## Have an impact on day 1

If you want a quick win to show your team, try refactoring these two common pain points:


1. Robust Environment Variables
Prevent your app from starting if .env keys are missing or malformed:

```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  SOME_ANALYTICS_URL: z.string().url().optional(),
  PORT: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
    message: 'PORT must be a valid number',
  }),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// If any environment variable is missing or invalid, this will throw an error and prevent the app from starting
const envResult = EnvSchema.parse(process.env);

export const env = envResult;
```

2. Typed LocalStorage
Stop guessing what is inside your user's browser storage:

```typescript
const UserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notificationsEnabled: z.boolean(),
});

function getUserSettings() {
  const settingsJson = localStorage.getItem('userSettings');
  if (!settingsJson) return null;

  const result = UserSettingsSchema.safeParse(JSON.parse(settingsJson));
  return result.success ? result.data : null;
}
```

---

## Conclusion

Hopefully I have convinced you and shown you enough of the basics of Zod to have a dabble and add it to your toolkit. I often see Zod being used just for form validation, but as shown here, it is so much more than that. It can help you build a moat around your application data, catching bugs at runtime before they reach your UI. 

By integrating Zod into your development workflow, you can ensure that your application handles data safely and reliably, providing a better experience for your users and reducing the risk of runtime errors. Give Zod a try in your next project and see how it can enhance your TypeScript applications!
