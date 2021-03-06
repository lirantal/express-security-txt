const securityTxt = require('../index')

test('validate doesnt throw an error on provided fields', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgments: 'thank you',
    canonical: 'https://example.com/.well-known/security.txt'
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

test('validate fails when acknowledgments property is not a string or array', () => {
  const options = {
    contact: 'email@example.com',
    encryption: '',
    acknowledgments: {}
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

test('validate fails when hiring property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    hiring: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when providing arrays', () => {
  const options = {
    contact: ['a', 'b', 'c'],
    acknowledgments: ['a', 'b', 'c'],
    policy: ['a', 'b', 'c'],
    hiring: ['a', 'b', 'c'],
    encryption: ['a', 'b', 'c']
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
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

test('deprecated spelling is allowed', () => {
  const options = {
    contact: '...',
    acknowledgement: '...' // deprecated spelling
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('using both deprecated spelling and new spelling throws', () => {
  const options = {
    contact: '...',
    acknowledgments: '...',
    acknowledgement: '...'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('passing an array for Canonical fails', () => {
  const options = {
    contact: '...',
    canonical: ['...', '...']
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully for the preferredLanguages key', () => {
  const optionsWithArray = {
    contact: '...',
    preferredLanguages: ['en', 'es']
  }

  const optionsWithString = {
    contact: '...',
    preferredLanguages: 'ru'
  }

  const optionsWithComment = {
    contact: '...',
    preferredLanguages: { comment: 'I am fluent in these', value: ['en', 'ru'] }
  }

  expect(() => securityTxt.validatePolicyFields(optionsWithArray)).not.toThrow()
  expect(() => securityTxt.validatePolicyFields(optionsWithString)).not.toThrow()
  expect(() => securityTxt.validatePolicyFields(optionsWithComment)).not.toThrow()
})

test('validate fails if Array<object> fed to preferredLanguages', () => {
  const options = {
    contact: '...',
    preferredLanguages: [
      { comment: '...', value: 'en' }
    ]
  }

  expect(() => securityTxt.validatePolicyFields(options).toThrow())
})
