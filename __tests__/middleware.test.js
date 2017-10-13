const securityTxtMiddleware = require('../index')

test('correctly handle middleware', () => {
  const options = {
    contact: 'email@example.com',
    disclosure: 'full',
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
