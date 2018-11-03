[![view on npm](http://img.shields.io/npm/v/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![view on npm](http://img.shields.io/npm/l/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![npm module downloads](http://img.shields.io/npm/dt/express-security-txt.svg)](https://www.npmjs.org/package/express-security-txt)
[![Build](https://travis-ci.org/lirantal/express-security-txt.svg?branch=master)](https://travis-ci.org/lirantal/express-security-txt)
[![codecov](https://codecov.io/gh/lirantal/express-security-txt/branch/master/graph/badge.svg)](https://codecov.io/gh/lirantal/express-security-txt)
[![Known Vulnerabilities](https://snyk.io/test/github/lirantal/express-security-txt/badge.svg)](https://snyk.io/test/github/lirantal/express-security-txt)
[![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/lirantal/express-security-txt.svg)](https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Express Security Txt

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
  contact: 'mailto:email@example.com',
  encryption: 'https://www.mykey.com/pgp-key.txt',
  acknowledgement: 'thank you'
}

app.use(securityTxt.setup(options))
```

### Chaining

Where allowed, you can provide multiple values for a single directive by passing an array.

```js
const securityTxt = require('express-security-txt')

const options = {
  contact: [
    'https://firstMethodOfContact.example.com',
    'https://secondMethodOfContact.example.com'
  ]
}

app.use(securityTxt.setup(options))
```

### Comments

To add a comment at the beggining or end of the security.txt file, one may use the keys `_prefixComment` and `postfixComment` respectively. If one wishes to place a comment immediately before a field, one may use an object which specifies the value of the field and the comment which must introduce it.

```js
const securityTxt = require('express-security-txt')

const options = {
  _prefixComment: 'This comment goes at the very beggining of the file',
  contact: {
    comment: 'This comment goes directly before the Contact: directive',
    value: 'mailto:email@example.com'
  },
  encryption: [
    'https://example.com/encryption',
    {
      comment: 'Comments can appear in the middle of an array of values',
      value: 'https://example.com/alternativeEncryption'
    }
  ],
  _postfixComment: 'This comment goes at the very end of the file'
}

app.use(securityTxt.setup(options))
```

Would generate the file

```txt
# This comment goes at the very beggining of the file
# This comment goes directly before the Contact: directive
Contact: mailto:email@example.com
Encryption: https://example.com/encryption
# Comments can appear in the middle of an array of values
Encryption: https://example.com/alternativeEncryption
# This comment goes at the very end of the file
```

If your comment spans multiple lines, you can use `\n` to split it. express-security-txt will automatically insert the relevant `#` symbols. Alternatively, one can use an array of lines instead of a string.

For example:

```js
const options = {
  _prefixComment: ['this is a', 'comment\nwhich', 'spans many lines'],
  contact: 'mailto:email@example.com'
}
```

Would generate

```txt
# this is a
# comment
# which
# spans many lines
Contact: mailto:email@example.com
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

## Contributing

### Commit Guidelines

The project uses the commitizen tool for standardizing changelog style commit
messages so you should follow it as so:

```bash
git add .           # add files to staging
yarn run commit      # use the wizard for the commit message
```
