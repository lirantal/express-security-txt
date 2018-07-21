const securityTxt = require('../index')

test('formats successfully with correct fields (singular contact field)', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'full',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Disclosure: full\n' +
    'Encryption: https://www.mykey.com/pgp-key.txt\n' +
    'Acknowledgement: thank you'
  )
})

test('formats successfully with mandatory fields only', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'full'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Disclosure: full'
  )
})

test('formats successfully with multiple contact options and values in-tact', () => {
  const email = 'email@example.com'
  const website = 'http://www.website.com'
  const phone = '+972+8+6173651'
  const disclosure = 'partial'
  const encryption = 'https://www.mykey.com/pgp-key.txt'
  const acknowledgement = 'http://my.website.com'

  const options = {
    contact: [
      email,
      website,
      phone
    ],
    disclosure: disclosure,
    encryption: encryption,
    acknowledgement: acknowledgement
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    `Contact: ${email}\n` +
    `Contact: ${website}\n` +
    `Contact: ${phone}\n` +
    `Disclosure: ${disclosure}\n` +
    `Encryption: ${encryption}\n` +
    `Acknowledgement: ${acknowledgement}`
  )
})

test('formats successfully with policy, hiring and signature fields', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'full',
    signature: 'http://example.com/.well-known/signature.txt.sig',
    policy: 'http://example.com/policy.txt',
    hiring: 'http://example.com/hiring.txt'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com\n' +
    'Disclosure: full\n' +
    'Signature: http://example.com/.well-known/signature.txt.sig\n' +
    'Policy: http://example.com/policy.txt\n' +
    'Hiring: http://example.com/hiring.txt'
  )
})
