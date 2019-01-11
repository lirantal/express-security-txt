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

Express middleware that implements a security.txt path and policy. Allows the repeating of a directive, as well as the insertion of comments.

References:
* [security.txt RFC](https://www.ietf.org/id/draft-foudil-securitytxt-04.txt)
* [security.txt project on github](https://github.com/securitytxt/security-txt)

## Installation

```bash
yarn add express-security-txt
```

## Usage

Define an options object with the keys that make up a valid [security.txt](https://www.ietf.org/id/draft-foudil-securitytxt-04.txt) file. All the keys are in camelCase.

```javascript
const securityTxt = require('express-security-txt')

const options = {
  contact: 'https://example.com/security/',
  preferredLanguages: 'en'
}

app.use(securityTxt.setup(options))
```

### Passing multiple values

Some directives allow you to specify multiple values. This package allows you to do this by passing an array:

```javascript
const options = {
  contact: ['mailto:security@example.com', 'https://example.com/security/']
}
```

### Adding comments

Comments can be included in the generated file. The `#` at the beggining of each line of a comment is automatically inserted by the package.

Comments at the start and end of a file can be added by using the `_prefixComment` and `_postfixComment` keys, like so:

```javascript
const options = {
  _prefixComment: 'This comment will appear at the beggining of the security.txt file',
  contact: 'mailto:security@example.com',
  _postfixComment: 'This comment will appear at the end of the security.txt file'
}
```

NOTE: You may include the newline character (`\n`), and the package will automatically insert the `#` symbol at the beggining of each line.

Multiline comments can also be added by specifying an array, where each element is a line of the comment.

<hr>

Comments just before a directive can be added by creating an object of the form `{ comment: '...', value: '...' }`, where the value associated with the `value` key is the value of the field; and the `comment` is the comment to appear directly before the field.

For example,

```javascript
const options = {
  contact: 'https://example.com/security/',
  acknowledgments: {
    comment: 'This comment will appear just above the Acknowledgments field',
    value: 'https://example.com/hall_of_fame'
  }
}
```

Would become

```
Contact: https://example.com/security/
# This comment will appear just above the Acknowledgments field
Acknowledgments: https://example.com/hall_of_fame
```

<hr>

If a field allows multiple values, you can leave a comment on each one like so:

```javascript
const options = {
  contact: [
    { comment: 'You can rarely reach me by email', value: 'mailto:security@example.com' },
    { comment: 'Try this online form instead?', value: 'https://example.com/security/' }
  ]
}
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
