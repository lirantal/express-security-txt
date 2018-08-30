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
    'Permission: none'
  )
})

test('formats successfully with mandatory field only', () => {
  const options = {
    contact: 'email@example.com'
  }

  const res = securityTxt.formatSecurityPolicy(options)

  expect(res).toBe(
    'Contact: email@example.com'
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
    `Acknowledgement: ${acknowledgement}`
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
    'Hiring: http://example.com/hiring.txt'
  )
})
