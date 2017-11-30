[![view on npm](http://img.shields.io/npm/v/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![view on npm](http://img.shields.io/npm/l/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![npm module downloads](http://img.shields.io/npm/dt/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![Build](https://travis-ci.org/lirantal/express-security-txt.svg?branch=master)](https://travis-ci.org/lirantal/express-security-txt)
[![codecov](https://codecov.io/gh/lirantal/express-security-txt/branch/master/graph/badge.svg)](https://codecov.io/gh/lirantal/express-security-txt)
[![Known Vulnerabilities](https://snyk.io/test/github/lirantal/express-security-txt/badge.svg)](https://snyk.io/test/github/lirantal/express-security-txt)

# Express Security Txt

[![Greenkeeper badge](https://badges.greenkeeper.io/lirantal/express-security-txt.svg)](https://greenkeeper.io/)

Express middleware that implements a security.txt path and policy

References:
* [security.txt rfc](https://www.ietf.org/id/draft-foudil-securitytxt-00.txt)
* [security.txt project on github](https://github.com/securitytxt/security-txt)

## Installation

```bash
yarn add express-security-txt
```

## Usage

Define an `options` object with the proper fields that make up a valid
[security.txt](https://www.ietf.org/id/draft-foudil-securitytxt-00.txt) policy,
and use it as a middleware for an express app.

```js
const securityTxt = require('express-security-txt')

const options = {
  contact: 'email@example.com',
  disclosure: 'full',
  encryption: 'https://www.mykey.com/pgp-key.txt',
  acknowledgement: 'thank you'
}

app.use(securityTxt.setup(options))
```

## Tests

Project tests:

```bash
yarn run test
```

Project linting:

```bash
yarn run lint
```

## Coverage

```bash
yarn run test:coverage
```

## Contributing

### Commit Guidelines

The project uses the commitizen tool for standardizing changelog style commit
messages so you should follow it as so:

```bash
git add .           # add files to staging
yarn run commit      # use the wizard for the commit message
```
