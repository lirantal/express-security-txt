const securityTxtMiddleware = require('../index')

test('correctly handle middleware setup for security policy', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const middleware = securityTxtMiddleware.setup(options)

  const req = {
    method: 'GET',
    path: '/security.txt'
  }

  const reqObject = jest.fn()
  const res = {
    status: (code) => {
      return {
        send: reqObject
      }
    }
  }
  const next = {}

  middleware(req, res, next)

  expect(reqObject.mock.calls.length).toBe(1)
})

test('skip middleware if method is not GET', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const middleware = securityTxtMiddleware.setup(options)

  const req = {
    method: 'POST'
  }

  const res = {}
  const next = jest.fn()

  middleware(req, res, next)

  expect(next.mock.calls.length).toBe(1)
})

test('skip middleware if path is not /security.txt', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgement: 'thank you'
  }

  const middleware = securityTxtMiddleware.setup(options)

  const req = {
    method: 'GET',
    path: '/some/other/route'
  }

  const res = {}
  const next = jest.fn()

  middleware(req, res, next)

  expect(next.mock.calls.length).toBe(1)
})

test('middleware will throw exception if no options provided', () => {
  expect(() => securityTxtMiddleware.setup()).toThrow()
})
