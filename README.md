# Auth service

## Table of content

- [Description](#description)
- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Environment](#environment)
- [Building and running](#building-and-running)

## Description

Service to create and authenticate users using Node.js.

## Stack

- **[Required]** [Node.js](https://nodejs.org/en)
- **[Required]** [Express.js](https://expressjs.com/)
- **[Required]** [Passport.js](https://www.passportjs.org/)
- **[Required]** [MongoDB](https://www.mongodb.com/)
- **[Required]** [Jest](https://jestjs.io/)

## Prerequisites

- **[Required]** [Git](http://git-scm.com/)
- **[Required]** [NPM](https://npmjs.com)
- **[Required]** [NVM](https://github.com/nvm-sh/nvm)
- **[Required]** [Node.js](http://nodejs.org/)
- **[Optional]** [Bruno](https://www.usebruno.com/)

## Environment

- **Localhost** http://localhost:3001

## Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                      |
| :---------------------- | :------------------------------------------ |
| `nvm use`               | Use the assigned node and npm versions      |
| `npm install`           | Installs dependencies                       |
| `npm start`             | Starts local dev server at `localhost:3001` |
| `npm run test`          | Run project tests                           |
| `npm run test:watch`    | Run project tests in watch mode             |
| `npm run test:coverage` | Run project tests to see its coverage       |
| `npm run lint`          | Run eslint to find problems in the code     |

## Run dev mode

### First time setup

```
  nvm use
  npm install
```

You must to have a file in the root, named **.env.local** with the next variables:

```
PORT=3001
MONGODB_URI=[YOUR_MONGO_DB_URI]
JWT_SECRET=[YOUR_JWT_SECRET]
JWT_EXPIRES_IN=[YOUR_JWT_EXPIRES]
NODE_ENV=['development'|'production']

```

For the `JWT_EXPIRES_IN` syntax see [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) documentation.

### Run the application

```
  npm start
```

By default, the service is going to be exposed on `http://localhost:3001`.
