const securityTxt = require('../index')

test('formats successfully with correct fields (singular contact field)', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgments: 'thank you'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Encryption: https://www.mykey.com/pgp-key.txt\n' +
    'Acknowledgments: thank you\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n'
  )
})

test('formats successfully with mandatory fields only', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Thu, 31 Dec 2020 18:37:07 -0800'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Expires: Thu, 31 Dec 2020 18:37:07 -0800\n'
  )
})

test('formats successfully with multiple contact options and values in-tact', () => {
  const email = 'email@example.com'
  const website = 'http://www.website.com'
  const phone = '+972+8+6173651'
  const encryption = 'https://www.mykey.com/pgp-key.txt'
  const acknowledgments = 'http://my.website.com'
  const expires = 'Thu, 31 Dec 2020 18:37:07 -0800'

  const options = {
    contact: [
      email,
      website,
      phone
    ],
    encryption,
    acknowledgments,
    expires
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    `Contact: ${email}\n` +
    `Contact: ${website}\n` +
    `Contact: ${phone}\n` +
    `Encryption: ${encryption}\n` +
    `Acknowledgments: ${acknowledgments}\n` +
    `Expires: ${expires}\n`
  )
})

test('formats successfully with policy and hiring fields', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    policy: 'http://example.com/policy.txt',
    hiring: 'http://example.com/hiring.txt'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Policy: http://example.com/policy.txt\n' +
    'Hiring: http://example.com/hiring.txt\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n'
  )
})

test('camelCasing works for different types of directives', () => {
  expect(securityTxt.camelCase('Abc')).toBe('abc')
  expect(securityTxt.camelCase('Abc-Def')).toBe('abcDef')
  expect(securityTxt.camelCase('Abc-Def-Ghi')).toBe('abcDefGhi')
})

test('formats successfully with comments', () => {
  const options = {
    contact: {
      comment: 'b',
      value: 'tel:+123'
    },
    expires: {
      comment: ['pq', 'r'],
      value: 'Fri, 2 Jan 1970 13:14:15 -0300'
    },
    encryption: [
      {
        value: 'https://a.example.com'
      },
      {
        value: 'https://b.example.com',
        comment: ['c', 'h', 'i\nj']
      },
      'https://c.example.com'
    ],
    _prefixComment: ['a', 'z', 'x\ny'],
    _postfixComment: 'd'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    '# a\n' +
    '# z\n' +
    '# x\n' +
    '# y\n' +
    '# b\n' +
    'Contact: tel:+123\n' +
    'Encryption: https://a.example.com\n' +
    '# c\n' +
    '# h\n' +
    '# i\n' +
    '# j\n' +
    'Encryption: https://b.example.com\n' +
    'Encryption: https://c.example.com\n' +
    '# pq\n' +
    '# r\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n' +
    '# d\n'
  )
})

test('uses new spelling with deprecated keys', () => {
  const options = {
    contact: 'tel:+123',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    acknowledgement: 'https://example.com'
  }

  global.console.warn = jest.fn()

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: tel:+123\n' +
    'Acknowledgments: https://example.com\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n'
  )

  expect(global.console.warn).toHaveBeenCalled()
})

test('preferredLanguages directive works with multiple values', () => {
  const options = {
    contact: 'mailto:security@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: ['en', 'ru', 'es']
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: mailto:security@example.com\n' +
    'Preferred-Languages: en, ru, es\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n'
  )
})

test('preferredLanguages directive works with one value only', () => {
  const options = {
    contact: 'mailto:security@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: 'en'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: mailto:security@example.com\n' +
    'Preferred-Languages: en\n' +
    'Expires: Fri, 2 Jan 1970 13:14:15 -0300\n'
  )
})
