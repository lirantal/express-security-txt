const securityTxt = require('../index')

test('validate doesnt throw an error on provided fields', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const res = securityTxt.validatePolicyFields(options)
  expect(res).toBe(true)
})

test('validate successfully when only mandatory properties provided', () => {
  const options = {
    contact: 'email@example.com'
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when options is not an object', () => {
  const options = ''

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when no contact property provided', () => {
  const options = {
    encryption: 'https://www.mykey.com/pgp-key.txt'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when encryption property is used with insecure http', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'http://www.mykey.com/pgp-key.txt'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when encryption property is used with dns scheme', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'dns:abc'
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when encryption property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    encryption: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when acknowledgement property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    encryption: '',
    acknowledgement: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when policy property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    policy: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when signature property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    signature: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when hiring property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    hiring: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})
