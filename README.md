# @public-function/wp

A thin drizzle based orm layer for the WordPress database.

## Why?

Because sometimes performance matters!

Most of the time it is totally fine to use the wordPress REST api. But when performance matters you do not want to spin up 
a WordPress stack just to query some data in the database. Especially if you have direct access to the database in your node setup.

## Getting started

```
$ npm i @public-function/wp drizzle-orm mysql2 
```

### Initialize 

```javascript
import mysql from 'mysql2';
import wpdb from '@public-function/wp';

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

const db = wpdb(pool, { db:{ prefix: "wp_" }});
```

Get typesafe results via drizzle schema objects.

```typescript
const siteUrl = (
    await db
        .select()
        .from(wp.options)
        .where(eq(wp.options.name, "siteurl"))
)[0];
```

or even easier with the wrapper function.

```typescript
import {getoption} from '@public-function/wp';
const siteUrl = await getOption(wp, "siteurl");
```

All default wordpress tables are defined:

- wp.options
- wp.posts
- wp.postMeta
- wp.comments
- wp.commentMeta
- wp.users
- wp.userMeta
- wp.terms
- wp.termMeta
- wp.termTaxonomy
- wp.termRelationships

Use query functions for WP_Query like results.

## Wrapper functions

There are some query functions for typical use cases like loading posts in a WP_Query like manner.


### WP_Query

```typescript
import {queryPosts} from "@pubic-function/wp";

const posts = await queryPosts(db, {});
```

## WP_Comment_Query

```typescript
import {queryComments} from "@pubic-function/wp";

const comments = await queryComments(db, {});
```

## WP_User_Query

```typescript
import {queryUsers} from "@pubic-function/wp";

const users = await queryUsers(db, {});
```

## Hydration

Use hydration functions to easily collect relational data, like metas or terms to a post.

```javascript
import {hydrateUsersWithMeta} from "@pubic-function/wp";
const users = await queryUsers(db, {});
const hydratedUsers = await hydrateUsersWithMeta(wp, users);
```
