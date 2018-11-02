'use strict'

const Joi = require('joi')
const DIRECTIVES = ['Contact', 'Encryption', 'Acknowledgement', 'Signature', 'Policy', 'Hiring', 'Permission']

class middleware {
  /**
   * creates an express middleware to respond with a compatible security.txt
   * policy
   * @param  {Object} [options={}] an option objects with security policy
   * @return {Function}            returns an express middleware function
   */
  static setup (options = {}) {
    const securityPolicy = this.formatSecurityPolicy(options)

    return (req, res, next) => {
      // Only handle requests for our intended use
      if ((req.path === '/security.txt' || req.path === '/.well-known/security.txt') &&
          req.method.toLowerCase() === 'get') {
        return res.status(200).header('Content-Type', 'text/plain').send(securityPolicy)
      }

      return next()
    }
  }

  /**
   * formats a given an options object with security policy properties
   * to output as a string
   * @param  {Object} options object with properties of a security.txt pocliy
   * @return {String}         string representation of the
   */
  static formatSecurityPolicy (options) {
    // Before applying formatting let's validate the options
    this.validatePolicyFields(options)

    let policySettingText = ''

    const tmpPolicyArray = []
    for (let directive of DIRECTIVES) {
      const key = this.camelCase(directive)

      if (!options.hasOwnProperty(key)) {
        continue
      }

      let value = options[key]

      if (typeof value !== 'object') {
        value = [ value ]
      }

      value.forEach(valueOption => {
        tmpPolicyArray.push(`${directive}: ${valueOption}\n`)
      })
    }

    policySettingText = tmpPolicyArray.join('')
    return policySettingText
  }

  /**
   * validates a security policy object confirms with standards of security.txt
   * reference: https://www.ietf.org/id/draft-foudil-securitytxt-00.txt
   * @param  {Object} options security policy object properties
   * @return {Boolean}        throws an error or returns true
   */
  static validatePolicyFields (options) {
    const array = Joi.array().single()
    const string = Joi.string()

    const schema = Joi.object().keys({
      acknowledgement: array.items(string),
      contact: array.required().items(string.required()),
      permission: string.only('none').insensitive(),
      encryption: array.items(string.regex(/^(?!http:)/i)),
      policy: array.items(string),
      hiring: array.items(string),
      signature: string
    }).label('options').required()

    const result = Joi.validate(options, schema)

    if (result.error) {
      throw new Error(result.error)
    }

    return true
  }

  /**
   * Converts a security.txt directive like 'Contact'
   * to the camelCase field name like 'contact'
   *
   * We assume that the contains a sequence of capitalised
   * words which have been strung together with hyphens.
   *
   * @param {string} directive - The name of the security.txt directive
   * @return {strng} The camelCase version of the directive
   */
  static camelCase (directive) {
    return directive.split('-').map((word, isNotFirst) => isNotFirst ? word : word.toLowerCase()).join('')
  }
}

module.exports = middleware
