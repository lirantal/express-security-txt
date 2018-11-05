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

test('validate fails when encryption property is not a string or array', () => {
  const options = {
    contact: 'email@example.com',
    encryption: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when acknowledgement property is not a string or array', () => {
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

test('validate fails when permission property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    permission: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when permission property is not "none"', () => {
  const options = {
    contact: 'email@example.com',
    permission: 'notnone'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when providing arrays', () => {
  const options = {
    contact: ['a', 'b', 'c'],
    acknowledgement: ['a', 'b', 'c'],
    policy: ['a', 'b', 'c'],
    hiring: ['a', 'b', 'c'],
    encryption: ['a', 'b', 'c']
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when providing arrays for signature/permission', () => {
  const options = {
    contact: 'abc',
    signature: ['a', 'b', 'c'],
    permission: ['none']
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when using prefix/postfix comments', () => {
  const options = {
    _prefixComment: ['This is a\nprefix', 'comment'],
    _postfixComment: 'This is a \npostfix comment',
    contact: 'mailto:security@example.com'
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate successfully when using objects for comments', () => {
  const options = {
    contact: [
      {
        comment: ['...', '...'],
        value: 'mailto:security@example.com'
      },
      {
        value: 'tel:+123'
      }
    ],
    encryption: {
      comment: '...',
      value: 'https://encryption.example.com'
    }
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when not providing a value in comment object', () => {
  const singleObject = {
    contact: {
      comment: ''
    }
  }

  const arrayOfObjects = {
    contact: [
      {
        comment: '...',
        value: 'tel:+123'
      },
      {
        comment: '...'
      }
    ]
  }

  expect(() => securityTxt.validatePolicyFields(singleObject)).toThrow()
  expect(() => securityTxt.validatePolicyFields(arrayOfObjects)).toThrow()
})

test('validate fails when using a [{value: [...]}] nested array', () => {
  const options = {
    contact: [{ value: ['test'] }],
    encryption: [{ value: ['test'] }]
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})
