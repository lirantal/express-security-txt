const securityTxtMiddleware = require('../index')

test('middleware redirects to ./well-known/security.txt if given /security.txt', () => {
  const options = {
    contact: 'email@example.com',
    expires: new Date('Thu, 31 Dec 2020 18:37:07'),
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgments: 'thank you'
  }

  const middleware = securityTxtMiddleware.setup(options)

  const req = {
    method: 'GET',
    path: '/security.txt'
  }

  const redirectFn = jest.fn()
  const res = {
    redirect: redirectFn
  }

  const next = {}

  middleware(req, res, next)

  expect(redirectFn).toHaveBeenCalledWith(301, '/.well-known/security.txt')
  expect(redirectFn).toHaveBeenCalledTimes(1)
})

test('correctly handle middleware setup for security policy', () => {
  const options = {
    contact: 'email@example.com',
    expires: new Date('Thu, 31 Dec 2020 18:37:07'),
    encryption: 'https://www.mykey.com/pgp-key.txt',
    acknowledgments: 'thank you'
  }

  const middleware = securityTxtMiddleware.setup(options)

  const req = {
    method: 'GET',
    path: '/.well-known/security.txt'
  }

  const sendFn = jest.fn()
  const headerFn = jest.fn().mockReturnValue({ send: sendFn })
  const statusFn = jest.fn().mockReturnValue({ header: headerFn })

  const res = {
    status: statusFn
  }

  const next = {}

  middleware(req, res, next)

  expect(statusFn).toHaveBeenCalledWith(200)
  expect(headerFn).toHaveBeenCalledWith('Content-Type', 'text/plain')

  expect(statusFn).toHaveBeenCalledTimes(1)
  expect(headerFn).toHaveBeenCalledTimes(1)
  expect(sendFn).toHaveBeenCalledTimes(1)
})

test('skip middleware if method is not GET', () => {
  const options = {
    contact: 'email@example.com',
    encryption: 'https://www.mykey.com/pgp-key.txt',
    expires: new Date('Fri, 2 Jan 1970 13:14:15'),
    acknowledgments: 'thank you'
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
    expires: new Date('Fri, 2 Jan 1970 13:14:15'),
    acknowledgments: 'thank you'
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
