# Joik

[![Build Status](https://travis-ci.org/alanhoff/node-joik.svg?branch=master)](https://travis-ci.org/alanhoff/node-joik)
[![codecov](https://codecov.io/gh/alanhoff/node-joik/branch/master/graph/badge.svg)](https://codecov.io/gh/alanhoff/node-joik)

Joik is a small store for Joi rules and schemas. The whole purpose is to avoid
circular dependency

### Rules

Rules are pure Joi objects that don't require any other code to be built.

```javascript
const joik = new Joik(Joi)

// Add a new rule to the store
joik.rule('user', Joi => Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required()
}))

// You can retrieve this rule later on
const rule = joik.rule('user')

// Since it's a Joi object you can use it as you wish
Joi.assert({
  name: 'Alan',
  username: 'alan'
}, rule)
```

### Schemas

Schemas are complex pieces of logic that can reuse pre-stored rules and other
schemas.

```javascript
// Create a new schema just like a rule, but now you can use the store object
// to retrieve other Joi objects
joik.schema('user-reply', (Joi, store) => Joi.object({
  created_at: Joi.date().iso(),
  data: store.rule('user')
}))

// To build the schema just call the function again without the second param
const schema = joik.schema('user-reply')
```

You since build methods returns a Joi object you can easily compose complex
schemas using Joi methods:

```javascript
joik.schema('user-ok-reply', (Joi, store) => {
  const schema = store.schema('user-reply')

  return schema.concat(Joi.object({
    pending_action: Joi.boolean().required()
  }))
})

// And again just call schema to build it
const schema = joik.schema('user-ok-reply')
```

### ISC License

Copyright (c) 2017, Alan Hoffmeister <alanhoffmeister@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
