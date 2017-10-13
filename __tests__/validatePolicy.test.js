const securityTxt = require('../index')

test('validate doesnt throw an error on provided fields', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'full',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const res = securityTxt.validatePolicyFields(options)
  expect(res).toBe(true)
})

test('validate fails when disclosure is non-standard', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'abc'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})
