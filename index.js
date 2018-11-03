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

    const asComment = comment => {
      const flatten = (a, b) => a.concat(b)

      if (!Array.isArray(comment)) {
        comment = [ comment ]
      }

      return comment
        .map(n => n.split`\n`)
        .reduce(flatten, [])
        .map(n => `# ${n}\n`)
        .join``
    }

    let policySettingText = ''

    const tmpPolicyArray = []
    for (let directive of DIRECTIVES) {
      const key = this.camelCase(directive)

      if (!options.hasOwnProperty(key)) {
        continue
      }

      let value = options[key] // eslint-disable-line security/detect-object-injection

      if (!Array.isArray(value)) {
        value = [ value ]
      }

      value.forEach(valueOption => {
        if (valueOption.hasOwnProperty('value')) {
          if (valueOption.hasOwnProperty('comment')) {
            tmpPolicyArray.push(asComment(valueOption.comment))
          }

          valueOption = valueOption.value
        }

        tmpPolicyArray.push(`${directive}: ${valueOption}\n`)
      })
    }

    if (typeof options._prefixComment !== 'undefined') {
      tmpPolicyArray.unshift(asComment(options._prefixComment))
    }

    if (typeof options._postfixComment !== 'undefined') {
      tmpPolicyArray.push(asComment(options._postfixComment))
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
    const comment = array.items(string)

    /**
     * A function to create a custom schema for a security.txt
     * field value.
     *
     * @param {object} [options={}] - requirements of this schema
     * @param {boolean} [options.canBeArray=true] - can singleValue appear in an array
     * @param {object} [singleValue=Joi.string()] - a Joi schema to validate a single entry (e.g. of an array)
     * @param {boolean} [required=false] - whether this schema must be present
     */
    const fieldValue = ({ canBeArray = true, singleValue = string, required = false } = {}) => {
      let schema = Joi.alternatives()

      schema = schema.try(singleValue)
      schema = schema.try(Joi.object().keys({
        comment: comment,
        value: (canBeArray ? array.items(schema) : schema).required()
      }))

      if (canBeArray) {
        schema = schema.try(array.items(schema))
      }

      if (required) {
        schema = schema.required()
      }

      return schema
    }

    const schema = Joi.object().keys({
      _prefixComment: comment,
      acknowledgement: fieldValue(),
      contact: fieldValue({ required: true }),
      permission: fieldValue({ canBeArray: false, singleValue: string.only('none').insensitive() }),
      encryption: fieldValue({ singleValue: string.regex(/^(?!http:)/i) }),
      policy: fieldValue(),
      hiring: fieldValue(),
      signature: fieldValue({ canBeArray: false }),
      _postfixComment: comment
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
   * We assume that the directive is a sequence of capitalised
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
