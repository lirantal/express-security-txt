const securityTxt = require('../index')

test('formats successfully with correct fields (singular contact field)', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you',
    permission: 'none'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Encryption: https://www.mykey.com/pgp-key.txt\n' +
    'Acknowledgement: thank you\n' +
    'Permission: none\n'
  )
})

test('formats successfully with mandatory field only', () => {
  const options = {
    contact: 'email@example.com'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n'
  )
})

test('formats successfully with multiple contact options and values in-tact', () => {
  const email = 'email@example.com'
  const website = 'http://www.website.com'
  const phone = '+972+8+6173651'
  const encryption = 'https://www.mykey.com/pgp-key.txt'
  const acknowledgement = 'http://my.website.com'

  const options = {
    contact: [
      email,
      website,
      phone
    ],
    encryption: encryption,
    acknowledgement: acknowledgement
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    `Contact: ${email}\n` +
    `Contact: ${website}\n` +
    `Contact: ${phone}\n` +
    `Encryption: ${encryption}\n` +
    `Acknowledgement: ${acknowledgement}\n`
  )
})

test('formats successfully with policy, hiring and signature fields', () => {
  const options = {
    contact: 'email@example.com',
    signature: 'http://example.com/.well-known/signature.txt.sig',
    policy: 'http://example.com/policy.txt',
    hiring: 'http://example.com/hiring.txt'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Signature: http://example.com/.well-known/signature.txt.sig\n' +
    'Policy: http://example.com/policy.txt\n' +
    'Hiring: http://example.com/hiring.txt\n'
  )
})

test('formats successfully with "none" not in lowercase for Permission: directive', () => {
  const options = {
    contact: 'email@example.com',
    permission: 'NoNe'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Permission: NoNe\n'
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
    encryption: [
      {
        value: 'https://a.example.com'
      },
      {
        value: 'https://b.example.com',
        comment: 'c'
      },
      'https://c.example.com'
    ],
    _prefixComment: 'a',
    _postfixComment: 'd'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    '# a\n' +
    '# b\n' +
    'Contact: tel:+123\n' +
    'Encryption: https://a.example.com\n' +
    '# c\n' +
    'Encryption: https://b.example.com\n' +
    'Encryption: https://c.example.com\n' +
    '# d\n'
  )
})
