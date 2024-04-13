# @public-function/wp

A thin drizzle based orm layer for the WordPress database.

## Why?

Because sometimes performance matters!

Most of the time it is totally fine to use the wordPress REST api. But when performance matters you do not want to spin up
a WordPress stack just to query some data in the database. Especially if you have direct access to the database in your node setup.

### 0.x ! 

Things will eventually change on the way to 1.0.

> 
> Breaking Changes:
> - 0.4.0 single argument constructor


## Getting started

```
$ npm i @public-function/wp drizzle-orm mysql2 
```

### Initialize 

```javascript
import mysql from 'mysql2/promise';
import connect from '@public-function/wp';

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

const wp = connect({ 
    db:{ 
        client: pool, 
        prefix: "wp_" 
    }
});

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
import {getOption} from '@public-function/wp';
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

Use query wrapper functions for WP_Query like results.

## Hydration

Use hydration functions to easily collect meta or term data.

### Posts

```javascript
import {
    hydratePostsWithMeta,
    hydratePostWithTerms,
    hydratePosts,
} from "@pubic-function/wp";
const posts = await wp.db.select().from(wp.posts);
const postsWithTerms = await hydratePostWithTerms(wp, posts);
const postsWithMeta = await hydratePostsWithMeta(wp, posts);
const postsWithTermsAndMeta = await hydratePosts(wp, posts);
```

### Comments

```javascript
import {hydrateCommentsWithMeta} from "@pubic-function/wp";
const comments = await wp.db.select().from(wp.comments);
const commentsWithMeta = await hydrateCommentsWithMeta(wp, comments);
```

### Users

```javascript
import {hydrateUsersWithMeta} from "@pubic-function/wp";
const users = await wp.db.select().from(wp.users);
const usersWithMeta = await hydrateUsersWithMeta(wp, users);
```

### Terms

```javascript
import {hydrateTermsWithMeta} from "@pubic-function/wp";
const terms = await wp.db.select().from(wp.terms);
const termsWithMeta = await hydrateTermsWithMeta(wp, terms);
```


## Wrapper functions

There are some query functions for typical use cases like loading posts in a WP_Query like manner. All results are automatically hydrated with meta and term data.


### WP_Query

```typescript
import {queryPosts} from "@pubic-function/wp";

const posts = await queryPosts(wp, {
    
});
```

### WP_Comment_Query

```typescript
import {queryComments} from "@pubic-function/wp";

const comments = await queryComments(wp, {
    
});
```

### WP_User_Query

```typescript
import {queryUsers} from "@pubic-function/wp";

const users = await queryUsers(wp, {
    
});
```
### WP_Taxonomy_Query

Coming soon...
