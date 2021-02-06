const securityTxt = require('../index')

test('validate doesnt throw an error on provided fields', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    expires: 'Thu, 31 Dec 2020 18:37:07 -0800',
    acknowledgments: 'thank you',
    canonical: 'https://example.com/.well-known/security.txt'
  }

  const res = securityTxt.validatePolicyFields(options)
  expect(res).toBe(true)
})

test('validate successfully when only mandatory properties provided', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Thu, 1 Jan 1970 04:53:10 +0100',
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when options is not an object', () => {
  const options = ''

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when no contact property provided', () => {
  const options = {
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: 'https://www.mykey.com/pgp-key.txt'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when encryption property is used with insecure http', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: 'http://www.mykey.com/pgp-key.txt'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when encryption property is used with dns scheme', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: 'dns:abc'
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('validate fails when encryption property is not a string or array', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when acknowledgments property is not a string or array', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    encryption: '',
    acknowledgments: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when policy property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    policy: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate fails when hiring property is not a string', () => {
  const options = {
    contact: 'email@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    hiring: {}
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully when providing arrays', () => {
  const options = {
    contact: ['a', 'b', 'c'],
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300', // mandatory, but specified not to be an array
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
    contact: 'mailto:security@example.com',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
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
    expires: {
        comment: ['...', '...'],
        value: 'Fri, 2 Jan 1970 13:14:15 -0300'
    },
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
    },

    expires: 'Fri, 2 Jan 1970 13:14:15 -0300'
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
    ],

    expires: 'Fri, 2 Jan 1970 13:14:15 -0300'
  }

  expect(() => securityTxt.validatePolicyFields(singleObject)).toThrow()
  expect(() => securityTxt.validatePolicyFields(arrayOfObjects)).toThrow()
})

test('validate fails when using a [{value: [...]}] nested array', () => {
  const options = {
    contact: [{ value: ['test'] }],
    encryption: [{ value: ['test'] }],
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('deprecated spelling is allowed', () => {
  const options = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    acknowledgement: '...' // deprecated spelling
  }

  expect(() => securityTxt.validatePolicyFields(options)).not.toThrow()
})

test('using both deprecated spelling and new spelling throws', () => {
  const options = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    acknowledgments: '...',
    acknowledgement: '...'
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('passing an array for Canonical fails', () => {
  const options = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    canonical: ['...', '...']
  }

  expect(() => securityTxt.validatePolicyFields(options)).toThrow()
})

test('validate successfully for the preferredLanguages key', () => {
  const optionsWithArray = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: ['en', 'es']
  }

  const optionsWithString = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: 'ru'
  }

  const optionsWithComment = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: { comment: 'I am fluent in these', value: ['en', 'ru'] }
  }

  expect(() => securityTxt.validatePolicyFields(optionsWithArray)).not.toThrow()
  expect(() => securityTxt.validatePolicyFields(optionsWithString)).not.toThrow()
  expect(() => securityTxt.validatePolicyFields(optionsWithComment)).not.toThrow()
})

test('validate fails if Array<object> fed to preferredLanguages', () => {
  const options = {
    contact: '...',
    expires: 'Fri, 2 Jan 1970 13:14:15 -0300',
    preferredLanguages: [
      { comment: '...', value: 'en' }
    ]
  }

  expect(() => securityTxt.validatePolicyFields(options).toThrow())
})
