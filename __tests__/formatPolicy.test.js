const securityTxt = require('../index')

test('formats successfully with correct fields (singular contact field)', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgments: 'thank you'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Encryption: https://www.mykey.com/pgp-key.txt\n' +
    'Acknowledgments: thank you\n'
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
  const acknowledgments = 'http://my.website.com'

  const options = {
    contact: [
      email,
      website,
      phone
    ],
    encryption,
    acknowledgments
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    `Contact: ${email}\n` +
    `Contact: ${website}\n` +
    `Contact: ${phone}\n` +
    `Encryption: ${encryption}\n` +
    `Acknowledgments: ${acknowledgments}\n`
  )
})

test('formats successfully with policy and hiring fields', () => {
  const options = {
    contact: 'email@example.com',
    policy: 'http://example.com/policy.txt',
    hiring: 'http://example.com/hiring.txt'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Policy: http://example.com/policy.txt\n' +
    'Hiring: http://example.com/hiring.txt\n'
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
    '# d\n'
  )
})

test('uses new spelling with deprecated keys', () => {
  const options = {
    contact: 'tel:+123',
    acknowledgement: 'https://example.com'
  }

  global.console.warn = jest.fn()

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: tel:+123\n' +
    'Acknowledgments: https://example.com\n'
  )

  expect(global.console.warn).toHaveBeenCalled()
})
