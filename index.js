'use strict'

const Joi = require('joi')
const DIRECTIVES = ['Contact', 'Encryption', 'Canonical', 'Acknowledgments', 'Preferred-Languages', 'Policy', 'Hiring', 'Expires']

/**
 * @TODO Fully remove outdated spelling in breaking changes
 *
 * An object mapping newer alternatives to their deprecated keys.
 * Ensures you can't use both spellings, and automatically triggers
 * a `console.warn` to encourage the user to make the switch.
 *
 * @const
 */
const DEPRECATIONS = {
  Acknowledgments: 'Acknowledgement'
}

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
      const CANONICAL = '/.well-known/security.txt'
      const ALTERNATIVES = ['/security.txt']

      // Only handle requests for our intended use
      if (req.method.toLowerCase() === 'get') {
        if (ALTERNATIVES.includes(req.path)) {
          return res.redirect(301, CANONICAL)
        } else if (req.path === CANONICAL) {
          return res.status(200).header('Content-Type', 'text/plain').send(securityPolicy)
        }
      }

      // Client did not request a security.txt policy
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

    /**
     * A reducer to insert the deprecated spellings of directives
     * directly after their correct spellings.
     *
     * @param {array} a - The accumulator, should be initialised with an empty array
     * @param {string} b - The correct spelling, which may or may not have a deprecated spelling
     * @return {array} An array with both the correct spellings and the deprecated spellings, with order conserved.
     */
    // eslint-disable-next-line security/detect-object-injection
    const addDeprecatedSpellings = (a, b) => DEPRECATIONS.hasOwnProperty(b) ? a.concat(b, DEPRECATIONS[b]) : a.concat(b)

    /**
     * A function to get the undeprecated spelling of a directive
     *
     * @param {string} directive - The (possibly deprecated) directive
     * @return {string} The undeprecated form of the directive
     */
    const undeprecate = directive => Object.entries(DEPRECATIONS).reduce(
      (a, b) => b[1] === directive ? b[0] : a
      , directive)

    for (let directive of DIRECTIVES.reduce(addDeprecatedSpellings, [])) {
      const key = this.camelCase(directive)
      const outputDirective = undeprecate(directive)

      if (!options.hasOwnProperty(key)) {
        continue
      }

      let value = options[key] // eslint-disable-line security/detect-object-injection

      if (outputDirective !== directive && typeof value !== 'undefined') {
        console.warn('[express-security-txt]: Deprecated key: "' + key + '". Use ' + this.camelCase(outputDirective) + ' instead')
      }

      if (!Array.isArray(value)) {
        value = [ value ]
      }

      // For the other fields, arrays are used to represent multiple occurences
      // of a field. However, for the Preferred-Language: directive, an array shows
      // a comma separated list. Convert the provided array into an array of one
      // value: a string with commas.
      if (outputDirective === 'Preferred-Languages') {
        value = [ value.map(languageCode => languageCode.trim()).join(', ') ]
      }

      value.forEach(valueOption => {
        if (valueOption.hasOwnProperty('value')) {
          if (valueOption.hasOwnProperty('comment')) {
            tmpPolicyArray.push(asComment(valueOption.comment))
          }

          valueOption = valueOption.value
        }

        tmpPolicyArray.push(`${outputDirective}: ${valueOption}\n`)
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
   * reference: https://www.ietf.org/id/draft-foudil-securitytxt-05.txt
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

      /**
       * A function which returns a schema for a comment object (of the form { comment: ..., value: ... })
       *
       * @param {boolean} [arrayAllowed=canBeArray] - Whether values can be arrays of values
       * @return {object} - a Joi schema
       */
      function commentSchema (arrayAllowed = canBeArray) {
        return Joi.object().keys({
          comment: comment,
          value: (arrayAllowed ? array.items(singleValue) : singleValue).required()
        })
      }

      schema = schema.try(singleValue)
      schema = schema.try(commentSchema())

      if (canBeArray) {
        schema = schema.try(array.items(
          Joi.alternatives().try(singleValue).try(commentSchema(false))
        ))
      }

      if (required) {
        schema = schema.required()
      }

      return schema
    }

    let uncompiledSchema = {
      _prefixComment: comment,
      acknowledgments: fieldValue(),
      contact: fieldValue({ required: true }),
      encryption: fieldValue({ singleValue: string.regex(/^(?!http:)/i) }),
      expires: fieldValue({ canBeArray: false, singleValue: string.regex(/(((Mon|Tue|Wed|Thu|Fri|Sat|Sun))[,]?\s[0-9]{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s([0-9]{4})\s([0-9]{2}):([0-9]{2})(:([0-9]{2}))?\s([\+|\-][0-9]{4})\s?/) }),
      preferredLanguages: fieldValue({ canBeArray: false, singleValue: array.items(string) }),
      policy: fieldValue(),
      hiring: fieldValue(),
      canonical: fieldValue({ canBeArray: false }),
      _postfixComment: comment
    }

    let schema = Joi.object().keys(uncompiledSchema).label('options').required()

    // Deprecate fields which have changed in the specification
    Object.entries(DEPRECATIONS).forEach(([notDeprecated, deprecated]) => {
      const [camelDep, camelNotDep] = [deprecated, notDeprecated].map(this.camelCase)

      schema = schema.keys({
        // eslint-disable-next-line security/detect-object-injection
        [camelDep]: uncompiledSchema[camelNotDep] // copy the schema for non-deprecated into deprecated
      })

      schema = schema.nand(camelDep, camelNotDep) // disallow using both keys at once
    })

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
